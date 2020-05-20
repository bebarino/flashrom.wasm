#ifndef RAIDEN_JS_H
#define RAIDEN_JS_H

#define LIBUSB(args) args

#define LIBUSB_ENDPOINT_OUT	0x00
#define LIBUSB_ENDPOINT_IN	0x80

extern int libusb_init();
extern int init_raiden_device(const char *serial, int *interfaceNumber, int *in_endpoint, int *out_endpoint);
extern int libusb_control_transfer(void *handle, uint8_t bmRequestType, uint8_t bRequest,
				   uint16_t wValue, uint16_t wIndex, unsigned char *data,
				   uint16_t wLength, unsigned int timeout);
extern int libusb_bulk_transfer(void *dev_handle, unsigned char endpoint, unsigned char *data, int length,
				int *transferred, unsigned int timeout);

#endif
