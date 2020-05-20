Module['api'] = {
	// void wasm_flashrom_lib_init()
	wasm_flashrom_lib_init: Module.cwrap('wasm_flashrom_lib_init', null, []),
	// const char *flashrom_version_info(void);
	flashrom_version_info: Module.cwrap('flashrom_version_info', 'string', []),

	// struct flashrom_programmer *wasm_setup_programmer(const char *params)
	wasm_setup_programmer: Module.cwrap('wasm_setup_programmer', 'number', ['string'], { async: true }),
	// struct flashrom_flashctx *wasm_probe_flash(struct flashrom_programmer *p)
	wasm_probe_flash: Module.cwrap('wasm_probe_flash', 'number', ['number'], { async: true }),
	// int flashrom_programmer_shutdown(struct flashrom_programmer *const flashprog)
	flashrom_programmer_shutdown: Module.cwrap('flashrom_programmer_shutdown', 'number', ['number'], { async: true }),

	// int flashrom_image_read(struct flashctx *const flashctx, void *const buffer, const size_t buffer_len)
	flashrom_image_read: Module.cwrap('flashrom_image_read', 'number', ['number', 'number', 'number'], { async: true }),
	// int flashrom_image_write(struct flashctx *const flashctx, void *const buffer, const size_t buffer_len,
	//                         const void *const refbuffer)
	flashrom_image_write: Module.cwrap('flashrom_image_write', 'number', ['number', 'number', 'number', 'number'], { async: true }),

	// size_t flashrom_flash_getsize(const struct flashrom_flashctx *const flashctx)
	flashrom_flash_getsize: Module.cwrap('flashrom_flash_getsize', 'number', ['number']),
	// const char *flashrom_flash_getname(const struct flashrom_flashctx *const flashctx)
	flashrom_flash_getname: Module.cwrap('flashrom_flash_getname', 'string', ['number']),
	// const char *flashrom_flash_getvendor(const struct flashrom_flashctx *const flashctx)
	flashrom_flash_getvendor: Module.cwrap('flashrom_flash_getvendor', 'string', ['number']),
	// void flashrom_flash_release(struct flashrom_flashctx *const flashctx)
	flashrom_flash_release: Module.cwrap('flashrom_flash_release', null, ['number']),

	// int flashrom_data_free(void *const p)
	// const char **flashrom_supported_programmers(void)
	// struct flashrom_flashchip_info *flashrom_supported_flash_chips(void)
};
