import MemoryRegion from "./MemoryRegion";
import GPUTile from "../GPU/GPUTile";

class MemoryVRAM extends MemoryRegion {
    _tileset = null;

    constructor () {
        super(8192, 0x1FFF);

        this._tileset = new Array(512);
        this._tileset.fill(new GPUTile());
    }

    reset () {
        super.reset();
        this._tileset.forEach(tile => tile.reset());
    }

    writeByte (address, value) {
        if (address >= 0x9000) {
            debugger;
        }
        super.writeByte(address, value);
        this._updateTile(address);
    }

    _updateTile (address) {
        let baseTileAddress = address & 0x1FFE;

        const isOdd = (baseTileAddress & 1) > 0;

        if (isOdd) {
            baseTileAddress--;
        }

        const tileIndex = (baseTileAddress >> 4) & (this._tileset.length - 1);
        const tileDataY = (baseTileAddress >> 1) & 7;
        const tile = this._tileset[tileIndex];

        for (let tileDataX = 0; tileDataX < tile._data[0].length; tileDataX++) {
            const pixelBitIndex = 1 << (7 - tileDataX);
            const pixelLowBit = this.readByte(baseTileAddress) & pixelBitIndex;
            const pixelHighBit = this.readByte(baseTileAddress + 1) & pixelBitIndex;

            const pixelValue = (pixelLowBit > 0 ? 1 : 0) + (pixelHighBit > 0 ? 2: 0);
            tile.update(tileDataX, tileDataY, pixelValue)
        }
    }

    getTilePixel (tileIndex, x, y) {
        return this._tileset[tileIndex].getPixel(x, y);
    }
}

export default MemoryVRAM;
