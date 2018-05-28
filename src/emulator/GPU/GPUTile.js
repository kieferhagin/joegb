class GPUTile {
    _data = [];

    constructor () {
        this.reset();
    }

    reset () {
        this._data = new Array(8);

        for (let y = 0; y < this._data.length; y++) {
            this._data[y] = new Array(8);
            this._data[y].fill(0);
        }
    }

    update (x, y, value) {
        this._data[y][x] = value;
    }

    getPixel (x, y) {
        return this._data[y][x];
    }
}

export default GPUTile;
