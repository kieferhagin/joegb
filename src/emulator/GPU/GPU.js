import CPUClock from "../CPU/CPUClock";
import GPUScreen from "./GPUScreen";

class GPU {
    static MODES = {
        HORIZONTAL_BLANK: 0,
        VERTICAL_BLANK: 1,
        OAM_READ: 2,
        VRAM_READ: 3
    };

    _mode = GPU.MODES.OAM_READ;
    _clock = null;
    _screen = null;
    _memory = null;

    constructor (memoryUnit) {
        this._clock = new CPUClock();
        this._screen = new GPUScreen();
        this._memory = memoryUnit;
    }

    reset () {
        this._mode = GPU.MODES.OAM_READ;
        this._clock.reset();
        this._screen.reset();
    }

    step (ticks) {
        this._clock.tick(ticks);

        if (this._mode === GPU.MODES.HORIZONTAL_BLANK) {
            return this._horizontalBlank();
        }

        if (this._mode === GPU.MODES.VERTICAL_BLANK) {
            return this._verticalBlank();
        }

        if (this._mode === GPU.MODES.OAM_READ) {
            return this._oamRead();
        }

        if (this._mode === GPU.MODES.VRAM_READ) {
            return this._vramRead();
        }

        throw Error('Invalid GPU mode: ' + this._mode);
    }

    _horizontalBlank () {
        if (this._clock.getBaseValue() < 51) {
            return;
        }

        this._clock.reset();

        if (this._memory._gpuRegisters._currentScanLine === 143) {
            this._mode = GPU.MODES.VERTICAL_BLANK;
            this._screen.render();

            return;
        }

        this._memory._gpuRegisters._currentScanLine++;
        this._mode = GPU.MODES.OAM_READ;
    }

    _verticalBlank () {
        if (this._clock.getBaseValue() < 114) {
            return;
        }

        this._clock.reset();

        if (this._memory._gpuRegisters._currentScanLine === 153) {
            this._memory._gpuRegisters._currentScanLine = 0;
            this._mode = GPU.MODES.OAM_READ;
            return;
        }

        this._memory._gpuRegisters._currentScanLine++;
    }

    _oamRead () {
        if (this._clock.getBaseValue() < 20) {
            return;
        }

        this._clock.reset();
        this._mode = GPU.MODES.VRAM_READ;
    }

    _vramRead () {
        if (this._clock.getBaseValue() < 43) {
            return;
        }

        this._clock.reset();
        this._mode = GPU.MODES.HORIZONTAL_BLANK;

        this._renderScanLine();
    }

    _renderScanLine () {
        if (!this._memory._gpuRegisters._displayEnabled) {
            return;
        }

        const tileY = this._memory._gpuRegisters.getTileY();
        const pixelY = this._memory._gpuRegisters.getPixelY();

        let currentTileX = this._memory._gpuRegisters.getTileX();
        let currentPixelX = this._memory._gpuRegisters.getPixelX();
        // console.log('Scan line: ' + this._memory._gpuRegisters.readCurrentScanLine());

        for (let i = 0; i < this._screen._width; i++) {
            const tileIndex = this._readTile(currentTileX, tileY);
            console.log(tileIndex);
            const tilePixel = this._memory._videoRAM.getTilePixel(tileIndex, currentPixelX, pixelY);
            const tilePixelColor = this._memory._gpuRegisters.getBackgroundPaletteColor(tilePixel);

            this._screen.setPixel(i, this._memory._gpuRegisters.readCurrentScanLine(), {
                r: tilePixelColor,
                g: tilePixelColor,
                b: tilePixelColor,
                a: 255
            });

            currentPixelX++;

            if (currentPixelX === 8) {
                currentPixelX = 0;
                currentTileX = ((currentTileX + 1) & 31);
            }
        }
    }

    _readTile (tileX, tileY) {
        let min = Math.ceil(0);
  let max = Math.floor(25);
  return Math.floor(Math.random() * (max - min + 1)) + min;
        return this._memory._gpuRegisters.offsetSignedTileIndex(this._memory._videoRAM.readByte(tileX + tileY));
    }
}

export default GPU;
