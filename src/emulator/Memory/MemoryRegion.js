/**
 * A region of memory which stores bytes and words. Can be pre-populated with existing data
 * (a ROM loaded from disc, for example).
 * Can be masked with an offset that designates its position in overall memory.
 */
class MemoryRegion {
    _originalData = null;
    _data = [];
    _offsetMask = 0xFFFF;

    /**
     *
     * @param {number} sizeInBytes - size of memory region in bytes
     * @param {number} offsetMask - all addresses are bitwise AND with this mask, which will mask the address to this region's position in overall memory
     * @param {Buffer|Array} [data] - existing data to load the region with by default and on reset
     */
    constructor (sizeInBytes, offsetMask, data=null) {
        if (!data) {
            this._data = new Array(sizeInBytes);
            this._data.fill(0);
        } else {
            this._originalData = data;
            this._data = this._originalData.slice();
        }

        this._offsetMask = offsetMask;
    }

    /**
     * Resets memory region to original data or all 0's if no original data
     */
    reset () {
        this._data = this._originalData ? this._originalData.slice() : this._data.fill(0);
    }

    /**
     * Return region size in bytes
     *
     * @returns {Number}
     */
    getSizeInBytes () {
        return this._data.length;
    }

    /**
     * Read a byte from this region.
     *
     * @param {number} address
     * @returns {number}
     */
    readByte (address) {
        return this._data[address & this._offsetMask];
    }

    /**
     * Write a byte to this region at address
     *
     * @param {number} address
     * @param {number} value
     */
    writeByte (address, value) {
        this._data[address & this._offsetMask] = value;
    }

    /**
     * Read a word (two bytes) from region
     *
     * @param {number} address
     * @returns {number}
     */
    readWord (address) {
        return this.readByte(address) + ((this.readByte(address + 1)) << 8);
    }

    /**
     * Write a word (two bytes) to memory
     *
     * @param {number} address
     * @param {number} value
     */
    writeWord (address, value) {
        this.writeByte(address, value & 255);
        this.writeByte(address + 1, (value >> 8));
    }
}

export default MemoryRegion;
