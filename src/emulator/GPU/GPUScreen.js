class GPUScreen {
    _width = 0;
    _height = 0;
    _data = [];
    _drawContext = null;

    constructor (width=160, height=144) {
        this._width = width;
        this._height = height;

        this.reset();
    }

    reset () {
        this._data = new Array(this._width * this._height * 4);
        this._data.fill(255);
    }

    getData () {
        return this._data;
    }

    setPixel (x, y, {r, g, b, a}) {
        const pixelPosition = (y * (this._width * 4)) + (x * 4);

        this._data[pixelPosition] = r;
        this._data[pixelPosition + 1] = g;
        this._data[pixelPosition + 2] = b;
        this._data[pixelPosition + 3] = a;
    }

    setCanvas (canvasElement) {
        this._drawContext = canvasElement.getContext('2d');
        this._drawContext.putImageData(new ImageData(new Uint8ClampedArray(this._data), this._width, this._height), 0, 0);
    }

    render () {
        this._drawContext.putImageData(new ImageData(new Uint8ClampedArray(this._data), this._width, this._height), 0, 0);
    }
}

export default GPUScreen;
