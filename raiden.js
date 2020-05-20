var LibraryUSB = {
	$USB: {
		device: null,
		interfaceNumber: -1,

		/*
		bulk_transfer_out: async function(handle, endpoint, data, length, transferred, timeout) {
			let buf = new Uint8Array(length);
			buf.set(HEAPU8.subarray(data, data + length));

			console.log(`tout: buf is ${buf} and length is ${length}`);
			let result = await handle.transferOut(endpoint, buf);

			if (result.data) {
				HEAPU32[transferred] = result.data.byteLength;
			}
			console.log(`transferred out ${result.data.byteLength}`);

			return 0;
		},

		bulk_transfer_in: async function(handle, endpoint, data, length, transferred, timeout) {
			console.log(`transfer in now`);
			let result = await handle.transferIn(endpoint, length);

			if (result.data) {
				console.log(`tin: buf is ${result.data} and length is ${result.data.byteLength}`);
				HEAPU32[transferred] = result.data.byteLength;
				Module.writeArrayToMemory(result.data, data);
			}

			return 0;
		},
		*/
	},

	libusb_init: function() {
		if ('usb' in navigator)
			return 0;
		return 1;
	},

	init_raiden_device__sig: 'isiii',
	init_raiden_device: function(serial, interfaceNumber, in_endpoint, out_endpoint) {
		return Asyncify.handleSleep(async function(wakeUp) {
			const serialStr = UTF8ToString(serial);
			console.log(`Looking for raiden with serialno ${serialStr}`);

			const devices = await navigator.usb.getDevices();
			const device = devices.find(d => serial == 0 || d.serialNumber == serialStr)

			if (device) {
				console.log(`Found raiden ${device.serialNumber}`);

				await device.open();
				if (device.configuration === null)
					await device.selectConfiguration(1);

				const found = device.configuration.interfaces.find(intf => {
					for (const alt of intf.alternates) {
						if (alt.interfaceClass == 255 && alt.interfaceSubclass == 0x51) {
							return true;
						}
					}
					return false;
				});

				if (found) {
					USB.interfaceNumber = found.interfaceNumber;
					HEAPU32[interfaceNumber >> 2] = USB.interfaceNumber;
					await device.claimInterface(USB.interfaceNumber);

					const in_ep = found.alternate.endpoints.find(e => e.direction == "in");
					const out_ep = found.alternate.endpoints.find(e => e.direction == "out");

					HEAPU32[in_endpoint >> 2] = in_ep.endpointNumber | 0x80;
					HEAPU32[out_endpoint >> 2] = out_ep.endpointNumber;

					USB.device = device;
					wakeUp(0);
					return;
				}
			}

			wakeUp(1);
		});
	},

	libusb_control_transfer__sig: 'iiiiiiiii',
	libusb_control_transfer: function(handle, bmRequestType, bRequest, wValue, wIndex, data, wLength, timeout) {
		return Asyncify.handleSleep(async function(wakeUp) {
			const ret = await USB.device.controlTransferOut({
				requestType: 'vendor',
				recipient: 'interface',
				request: bRequest,
				value: wValue,
				index: wIndex });

			switch (ret.status) {
				case 'ok':
					wakeUp(0);
					break;
				default:
					wakeUp(1);
					break;
			}
		});
	},

	libusb_bulk_transfer__sig: 'iiiiiii',
	libusb_bulk_transfer: function(handle, endpoint, data, length, transferred, timeout) {
		return Asyncify.handleSleep(async function(wakeUp) {
			if (endpoint & 0x80) {
				//console.log(`transfer in now`);
				let result = await USB.device.transferIn(endpoint & ~0x80, length);

				if (result.data) {
					const u8data = new Uint8Array(result.data.buffer);
					//console.log(`tin: buf is ${u8data} and length is ${result.data.byteLength}`);
					HEAPU32[transferred >> 2] = result.data.byteLength;
					writeArrayToMemory(u8data, data);
				} else {
					HEAPU32[transferred >> 2] = 0;
				}
			} else {
				let buf = new Uint8Array(length);
				buf.set(HEAPU8.subarray(data, data + length));

				//console.log(`tout: buf is ${buf} and length is ${length}`);
				let result = await USB.device.transferOut(endpoint, buf);

				if (result.status == "ok") {
					HEAPU32[transferred >> 2] = result.bytesWritten
					//console.log(`transferred out ${result.bytesWritten}`);
				} else {
					HEAPU32[transferred >> 2] = 0;
				}
			}

			wakeUp(0);
		});
	},
};

autoAddDeps(LibraryUSB, '$USB');
mergeInto(LibraryManager.library, LibraryUSB);
