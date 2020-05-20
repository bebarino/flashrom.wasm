#include <emscripten.h>
#include <stdio.h>

#include "libflashrom.h"

static int wasm_print_cb(enum flashrom_log_level level, const char *fmt, va_list ap)
{
	int ret = 0;
	FILE *output_type = stdout;

	if (level < FLASHROM_MSG_INFO)
		output_type = stderr;

	ret = vfprintf(output_type, fmt, ap);
	/* msg_*spew often happens inside chip accessors in possibly
	 * time-critical operations. Don't slow them down by flushing. */
	if (level != FLASHROM_MSG_SPEW)
		fflush(output_type);
	return ret;
}

EMSCRIPTEN_KEEPALIVE
void wasm_flashrom_lib_init()
{
	flashrom_set_log_callback(wasm_print_cb);
}

EMSCRIPTEN_KEEPALIVE
struct flashrom_programmer *wasm_setup_programmer(const char *params)
{
	int ret;
	struct flashrom_programmer *prgmr = NULL;

	ret = flashrom_programmer_init(&prgmr, "raiden_debug_wasm", params);
	if (ret)
		return NULL;

	return prgmr; /* This isn't actually used though.. */
}

EMSCRIPTEN_KEEPALIVE
struct flashrom_flashctx *wasm_probe_flash(struct flashrom_programmer *p)
{
	int ret;
	struct flashrom_flashctx *flash = NULL;

	ret = flashrom_flash_probe(&flash, p, NULL);
	if (ret) {
		flashrom_programmer_shutdown(p);
		return NULL;
	}

	return flash; /* This pointer is used at least */
}
