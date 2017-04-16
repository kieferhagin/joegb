import CPUClock from "../CPU/CPUClock";

class GPU {
    static MODES = {
        HORIZONTAL_BLANK: 0,
        VERTICAL_BLANK: 1,
        OAM_READ: 2,
        VRAM_READ: 3
    };

    _mode = GPU.MODES.OAM_READ;
    _clock = null;
    _currentLine = 0;

    constructor () {
        this._clock = new CPUClock();
    }

    reset () {
        this._mode = GPU.MODES.OAM_READ;
        this._clock.reset();
        this._currentLine = 0;
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

        if (this._currentLine === 143) {
            this._mode = GPU.MODES.VERTICAL_BLANK;

            return;
        }

        this._currentLine++;
        this._mode = GPU.MODES.OAM_READ;
    }

    _verticalBlank () {
        if (this._clock.getBaseValue() < 114) {
            return;
        }

        this._clock.reset();

        if (this._currentLine === 153) {
            this._currentLine = 0;
            this._mode = GPU.MODES.OAM_READ;
            return;
        }

        this._currentLine++;
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
    }
}

export default GPU;
