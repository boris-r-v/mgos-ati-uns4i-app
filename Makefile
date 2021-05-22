.PHONY: build clean remake flash

all: build flash
    
build: 
		mos build --clean --local --verbose --platform=esp32

clean:
		rm -rf build deps

remake: clean build

flash:
		mos flash