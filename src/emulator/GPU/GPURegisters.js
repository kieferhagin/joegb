class GPURegisters {
    static SPRITE_SIZES = {
        EIGHT_BY_EIGHT: 0,
        EIGHT_BY_SIXTEEN: 1
    };

    static PALETTE_VALUES = [
        255, 192, 96, 0
    ];

    _scrollX = 0;
    _scrollY = 0;
    _windowX = 0;
    _windowY = 0;
    _currentScanLine = 0;
    _scanLineCompare = 0;

    _displayEnabled = false;
    _backgroundEnabled = false;
    _spritesEnabled = false;
    _windowEnabled = false;
    _spriteSize = GPURegisters.SPRITE_SIZES.EIGHT_BY_EIGHT;
    _backgroundTilemapIndex = 0;
    _backgroundTilesetIndex = 0;
    _windowTileMap = 0;

    _backgroundPalette = [255, 255, 255, 255];
    
    reset () {
        this._scrollX = 0;
        this._scrollY = 0;
        this._windowX = 0;
        this._windowY = 0;
        this._currentScanLine = 0;
        this._scanLineCompare = 0;

        this._displayEnabled = false;
        this._backgroundEnabled = false;
        this._spritesEnabled = false;
        this._windowEnabled = false;
        this._spriteSize = GPURegisters.SPRITE_SIZES.EIGHT_BY_EIGHT;
        this._backgroundTilemapIndex = 0;
        this._backgroundTilesetIndex = 0;
        this._windowTileMap = 0;

        this._backgroundPalette.fill(255);
    }

    readRegisters (address) {
        if (address === 0xFF40) {
            return this.readControlRegister();
        }

        if (address === 0xFF41) {
            // TODO: Move GPU status to here
            debugger;
            return 0;
        }

        if (address === 0xFF42) {
            return this.readScrollY();
        }

        if (address === 0xFF43) {
            return this.readScrollX();
        }

        if (address === 0xFF44) {
            return this.readCurrentScanLine();
        }

        if (address === 0xFF45) {
            // TODO: implement scan line compare
            debugger;
            return 0;
        }

        if (address == 0xFF4A) {
            return this.readWindowY();
        }

        if (address == 0xFF4B) {
            return this.readWindowX();
        }

        // TODO: implement GameBoy color specific registers
        // TODO: move palette switching to here
        debugger;
        return 0;
    }

    readControlRegister () {
        const backgroundEnabled = this._backgroundEnabled ? 0x01 : 0x00;
        const spritesEnabled = this._spritesEnabled ? 0x02 : 0x00;
        const spriteSize = this._spriteSize > 0 ? 0x04 : 0x00;
        const backgroundTilemapIndex = this._backgroundTilemapIndex > 0 ? 0x08 : 0x00;
        const backgroundTilesetIndex = this._backgroundTilesetIndex > 0 ? 0x10 : 0x00;
        const windowEnabled = this._windowEnabled ? 0x20 : 0x00;
        const windowTileMap = this._windowTileMap > 0 ? 0x40 : 0x00;
        const displayEnabled = this._displayEnabled ? 0x80 : 0x00;

        return backgroundEnabled | spritesEnabled |
            spriteSize | backgroundTilemapIndex | backgroundTilesetIndex |
            windowEnabled | windowTileMap | displayEnabled;
    }

    readScrollY () {
        return this._scrollY;
    }

    readScrollX () {
        return this._scrollX;
    }

    readCurrentScanLine () {
        return this._currentScanLine;
    }

    readWindowY () {
        return this._windowY;
    }

    readWindowX () {
        return this._windowX - 7;
    }

    writeRegisters (address, value) {
        if (address === 0xFF40) {
            this._displayEnabled = (value & 0x80) > 0;
            this._windowTileMap = (value & 0x40) > 0 ? 1 : 0;
            this._windowEnabled = (value & 0x20) > 0;
            this._backgroundTilesetIndex = (value & 0x10) > 0 ? 1 : 0;
            this._backgroundTilemapIndex = (value & 0x08) > 0 ? 1 : 0;
            this._spriteSize = (value & 0x04) > 0 ? GPURegisters.SPRITE_SIZES.EIGHT_BY_SIXTEEN : GPURegisters.SPRITE_SIZES.EIGHT_BY_EIGHT;
            this._spritesEnabled = (value & 0x02) > 0;
            this._backgroundEnabled = (value & 0x01) > 0;

            return;
        }

        if (address === 0xFF42) {
            this._scrollY = value;
            return;
        }

        if (address === 0xFF43) {
            this._scrollX = value;
            return;
        }

        // 0xFF44 is read-only, skipped here

        if (address === 0xFF45) {
            this._scanLineCompare = value;
            return;
        }

        if (address === 0xFF46) {
            // TODO: add OAM functionality
            return;
        }

        if (address === 0xFF47) {
            this._setBackgroundPalette(value);
            return;
        }

        if (address === 0xFF48) {
            // TODO: sprite 0 palette
            return;
        }

        if (address === 0xFF49) {
            // TODO: sprite 1 palette
            return;
        }

        debugger;
    }

    _setBackgroundPalette (value) {
        for (let position = 0; position < this._backgroundPalette.length; position++) {
            const paletteMappedValue = (value >> (position * 2)) & 3;
            this._backgroundPalette[position] = GPURegisters.PALETTE_VALUES[paletteMappedValue];
        }
    }

    getTileY () {
        const tileMapOffset = this._backgroundTilemapIndex > 0 ? 0x1C00 : 0x1800;
        const tileLineOffset = ((((this._currentScanLine + this._scrollY) & 255) >> 3) << 5);

        return tileMapOffset + tileLineOffset;
    }

    getTileX () {
        return ((this._scrollX >> 3) & 31);
    }

    getPixelY () {
        return ((this._currentScanLine + this._scrollY) & 7);
    }

    getPixelX () {
        return (this._scrollX & 7);
    }

    offsetSignedTileIndex (signedTileIndex) {
        if (this._backgroundTilesetIndex > 0 && signedTileIndex < 128) {
            return signedTileIndex + 256;
        }

        return signedTileIndex;
    }

    getBackgroundPaletteColor (tilePixel) {
        return this._backgroundPalette[tilePixel];
    }
}

export default GPURegisters;
