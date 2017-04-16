class CPURegisters {
    static FLAGS = {
        ZERO: 0x80,
        SUBTRACTION: 0x40,
        HALF_CARRY: 0x20,
        CARRY: 0x10,
        NONE: 0x00
    };

    // 8 bit registers
    _a = 0;
    _b = 0;
    _c = 0;
    _d = 0;
    _e = 0;
    _h = 0;
    _l = 0;
    _flags = 0;

    // 16 bit registers
    _programCounter = 0;
    _stackPointer = 0;

    reset () {
        this._a = 0;
        this._b = 0;
        this._c = 0;
        this._d = 0;
        this._e = 0;
        this._h = 0;
        this._l = 0;
        this._flags = 0;

        this._programCounter = 0;
        this._stackPointer = 0;
    }

    incrementProgramCounter () {
        return this._programCounter++;
    }

    maskProgramCounter () {
        this._programCounter &= 65535;
    }

    isZeroFlagSet () {
        return (this._flags & CPURegisters.FLAGS.ZERO) === CPURegisters.FLAGS.ZERO;
    }

    isSubtractionFlagSet () {
        return (this._flags & CPURegisters.FLAGS.SUBTRACTION) === CPURegisters.FLAGS.SUBTRACTION;
    }

    isHalfCarryFlagSet () {
        return (this._flags & CPURegisters.FLAGS.HALF_CARRY) === CPURegisters.FLAGS.HALF_CARRY;
    }

    isCarryFlagSet () {
        return (this._flags & CPURegisters.FLAGS.CARRY) === CPURegisters.FLAGS.CARRY;
    }

    getHLRegister () {
        return (this._h << 8) + this._l;
    }

    setHLRegister (word) {
        this._l = word & 255;
        this._h = word >> 8;
    }

    getDERegister () {
        return (this._d << 8) + this._e;
    }

    setDERegister (word) {
        this._e = word & 255;
        this._d = word >> 8;
    }

    getBCRegister () {
        return (this._b << 8) + this._c;
    }

    setBCRegister (word) {
        this._c = word & 255;
        this._b = word >> 8;
    }
}

export default CPURegisters;
