#!/bin/sh

version=$(./util/getrevision.sh --revision)

#funcs=$(sed -nE 's/ *(flashrom_.*);/_\1/p' libflashrom.map | while read l; do echo -n "'$l', "; done)
#funcs=${funcs%, }

funcs="'_flashrom_version_info', '_flashrom_programmer_shutdown', '_flashrom_image_read', '_flashrom_image_write', '_flashrom_flash_getsize', '_flashrom_flash_getname', '_flashrom_flash_getvendor', '_flashrom_flash_release', '_flashrom_data_free', '_flashrom_supported_programmers'"

CFLAGS="-Wno-format"
CFLAGS="$CFLAGS -Wwrite-strings"
CFLAGS="$CFLAGS -Wno-unused-parameter"
CFLAGS="$CFLAGS -Wno-address-of-packed-member"
CFLAGS="$CFLAGS -Wno-enum-conversion"
CFLAGS="$CFLAGS -Wno-missing-braces"

AR=emar RANLIB=emranlib WASM=1 \
emcc -O1 \
     -s "EXPORTED_FUNCTIONS=[$funcs]" \
     -s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' \
     -s ENVIRONMENT=web \
     -s ALLOW_MEMORY_GROWTH=1 \
     --js-library raiden.js \
     --post-js api.js \
     -D'CONFIG_RAIDEN_WASM=1' \
     -DFLASHROM_VERSION="\"${version}\"" \
     -s ASYNCIFY=1 \
     -s 'ASYNCIFY_IMPORTS=["init_raiden_device", "libusb_control_transfer", "libusb_bulk_transfer"]' \
     82802ab.c \
     at45db.c \
     edi.c \
     en29lv640b.c \
     flashchips.c \
     flashrom.c \
     fmap.c \
     helpers.c \
     ich_descriptors.c \
     jedec.c \
     layout.c \
     libflashrom.c \
     opaque.c \
     print.c \
     programmer.c \
     sfdp.c \
     spi25.c \
     spi25_statusreg.c \
     spi95.c \
     spi.c \
     sst28sf040.c \
     sst49lfxxxc.c \
     sst_fwhub.c \
     stm50.c \
     udelay.c \
     w29ee011.c \
     w39.c \
     raiden_debug_spi_wasm.c \
     dummyflasher.c \
     libflashrom.wasm.c \
     -o libflashrom.mjs \
     -s 'EXPORT_NAME="libflashrom"' -s MODULARIZE=1
