import CPURegisters from './CPURegisters';

class CPUOperationMap {
    _operationMap = new Array(10000);
    _extendedOperationMap = new Array(10000);

    static _isHalfCarry (result, target, value) {
        return ((result ^ target ^ value) & 0x10) > 0;
    }

    constructor () {
        const noOp = 0x00;
        const decrementB = 0x05;
        const loadByteIntoB = 0x06;
        const incrementC = 0x0C;
        const loadByteIntoC = 0x0E;
        const loadWordIntoDE = 0x11;
        const rotateALeft = 0x17;
        const loadDEPointerIntoA = 0x1A;
        const relativeJumpIfZeroFlag = 0x20;
        const loadWordIntoHL = 0x21;
        const loadAToHLAddressIncrement = 0x22;
        const incrementHL = 0x23;
        const loadWordIntoStackPointer = 0x31;
        const loadAToHLAddressDecrement = 0x32;
        const incrementStackPointer = 0x33;
        const loadByteIntoA = 0x3E;
        const copyAToC = 0x4F;
        const loadAToHLAddress = 0x77;
        const addBToA = 0x80;
        const xorA = 0xAF;
        const popStackToBC = 0xC1;
        const pushBCToStack = 0xC5;
        const extensionOperation = 0xCB;
        const callRoutineAtWord = 0xCD;
        const return_ = 0xC9;
        const loadAIntoOffsetImmediate = 0xE0;
        const loadAIntoOffsetC = 0xE2;
        const compareByteToA = 0xFE;

        this._operationMap[noOp] = this._noOp;
        this._operationMap[decrementB] = this._decrementB;
        this._operationMap[loadByteIntoB] = this._loadByteIntoB;
        this._operationMap[incrementC] = this._incrementC;
        this._operationMap[loadByteIntoC] = this._loadByteIntoC;
        this._operationMap[loadWordIntoDE] = this._loadWordIntoDE;
        this._operationMap[rotateALeft] = this._rotateALeft;
        this._operationMap[loadDEPointerIntoA] = this._loadDEPointerIntoA;
        this._operationMap[relativeJumpIfZeroFlag] = this._relativeJumpIfZeroFlag;
        this._operationMap[loadWordIntoHL] = this._loadWordIntoHL;
        this._operationMap[loadAToHLAddressIncrement] = this._loadAToHLAddressIncrement;
        this._operationMap[incrementHL] = this._incrementHL;
        this._operationMap[loadWordIntoStackPointer] = this._loadWordIntoStackPointer;
        this._operationMap[loadAToHLAddressDecrement] = this._loadAToHLAddressDecrement;
        this._operationMap[incrementStackPointer] = this._incrementStackPointer;
        this._operationMap[loadByteIntoA] = this._loadByteIntoA;
        this._operationMap[copyAToC] = this._copyAToC;
        this._operationMap[loadAToHLAddress] = this._loadAToHLAddress;
        this._operationMap[addBToA] = this._addBToA;
        this._operationMap[xorA] = this._xorA;
        this._operationMap[popStackToBC] = this._popStackToBC;
        this._operationMap[pushBCToStack] = this._pushBCToStack;
        this._operationMap[extensionOperation] = this._extensionOperation.bind(this);
        this._operationMap[callRoutineAtWord] = this._callRoutineAtWord;
        this._operationMap[return_] = this._return;
        this._operationMap[loadAIntoOffsetImmediate] = this._loadAIntoOffsetImmediate;
        this._operationMap[loadAIntoOffsetC] = this._loadAIntoOffsetC;
        this._operationMap[compareByteToA] = this._compareByteToA;

        const rotateCLeft = 0x11;
        const testBit7FromH = 0x7C;

        this._extendedOperationMap[rotateCLeft] = this._rotateCLeft;
        this._extendedOperationMap[testBit7FromH] = this._testBit7FromH;
    }

    getOperation (opCode) {
        const operation = this._operationMap[opCode];
        // console.log(operation);

        if (!operation) {
            throw Error('Undefined operation code: ' + opCode);
        }

        return operation;
    }

    /**
     * (0x00, NOP) No operation
     *
     * @returns {number} Ticks
     * @private
     */
    _noOp () {
        return 1;
    }

    /**
     * (0x05, DEC B) Decrement B by one
     *
     * @param cpu
     * @returns {number}
     * @private
     */
    _decrementB (cpu) {
        cpu._registers._b--;
        cpu._registers._b &= 255;

        cpu._registers._flags = cpu._registers.isCarryFlagSet() ?
            CPURegisters.FLAGS.CARRY + CPURegisters.FLAGS.SUBTRACTION : CPURegisters.FLAGS.SUBTRACTION;

        if (cpu._registers._b === 0) {
            cpu._registers._flags |= CPURegisters.FLAGS.ZERO;
        }

        if (CPUOperationMap._isHalfCarry(cpu._registers._b, 1, cpu._registers._b + 1)) {
            cpu._registers._flags |= CPURegisters.FLAGS.HALF_CARRY;
        }

        return 1;
    }

    /**
     * (0x06, LD B n) Load immediate byte into B register
     *
     * @param cpu
     * @returns {number}
     * @private
     */
    _loadByteIntoB (cpu) {
        cpu._registers._b = cpu._memory.readByte(cpu._registers._programCounter);
        cpu._registers.incrementProgramCounter();

        return 2;
    }

    /**
     * (0x0C, INC C) Increment C register
     *
     * @param cpu
     * @returns {number}
     * @private
     */
    _incrementC (cpu) {
        cpu._registers._c++;
        cpu._registers._c &= 255;

        cpu._registers._flags = cpu._registers.isCarryFlagSet() ?
            CPURegisters.FLAGS.CARRY : CPURegisters.FLAGS.NONE;

        if (cpu._registers._c === 0) {
            cpu._registers._flags |= CPURegisters.FLAGS.ZERO;
        }

        if (CPUOperationMap._isHalfCarry(cpu._registers._c, 1, cpu._registers._c - 1)) {
            cpu._registers._flags |= CPURegisters.FLAGS.HALF_CARRY;
        }

        return 1;
    }

    /**
     * (0x0E, LD C n) Load immediate byte into C register
     *
     * @param cpu
     * @returns {number}
     * @private
     */
    _loadByteIntoC (cpu) {
        cpu._registers._c = cpu._memory.readByte(cpu._registers._programCounter);
        cpu._registers.incrementProgramCounter();

        return 2;
    }

    /**
     * (0x11, LD DE nn) Load immediate word into DE registers
     *
     * @param cpu
     * @returns {number}
     * @private
     */
    _loadWordIntoDE (cpu) {
        cpu._registers._e = cpu._memory.readByte(cpu._registers._programCounter);
        cpu._registers._d = cpu._memory.readByte(cpu._registers._programCounter + 1);

        cpu._registers._programCounter += 2;

        return 3;
    }

    /**
     * (0x17, RL A) Rotate A left, and store 7th bit of original A in carry flag
     *
     * @param cpu
     * @returns {number}
     * @private
     */
    _rotateALeft (cpu) {
        const aRight = cpu._registers.isCarryFlagSet() ? 1 : 0;
        const rotateWillCarry = cpu._registers._a & 0x80 > 0;

        cpu._registers._a = (cpu._registers._a << 1) + aRight;
        cpu._registers._a &= 255;

        cpu._registers._flags = cpu._registers._a === 0 ?
            CPURegisters.FLAGS.ZERO : CPURegisters.FLAGS.NONE;

        if (rotateWillCarry) {
            cpu._registers._flags |= CPURegisters.FLAGS.CARRY;
        }

        return 2;
    }

    /**
     * (0x1A, LD A (DE)) Load byte at DE pointer into A
     *
     * @param cpu
     * @returns {number}
     * @private
     */
    _loadDEPointerIntoA (cpu) {
        cpu._registers._a = cpu._memory.readByte(cpu._registers.getDERegister());

        return 2;
    }

    /**
     * (0x20, JR NZ n) Jump to relative position if Zero flag is not set
     *
     * @param cpu
     * @returns {number}
     * @private
     */
    _relativeJumpIfZeroFlag (cpu) {
        let jumpChange = cpu._memory.readByte(cpu._registers._programCounter);

        // flip sign if representing negative number
        if (jumpChange > 127) {
            jumpChange = -((~jumpChange + 1) & 255);
        }

        cpu._registers.incrementProgramCounter();

        if (!cpu._registers.isZeroFlagSet()) {
            cpu._registers._programCounter += jumpChange;
            return 3;
        }

        return 2;
    }

    /**
     * (0x21, LD HL nn) Loads a word into HL registers
     *
     * @param cpu
     * @returns {number}
     * @private
     */
    _loadWordIntoHL (cpu) {
        cpu._registers._l = cpu._memory.readByte(cpu._registers._programCounter);
        cpu._registers._h = cpu._memory.readByte(cpu._registers._programCounter + 1);

        cpu._registers._programCounter += 2;

        return 3;
    }

    /**
     * (0x22, LDI HL A) Loads value of A register into address stored at HL, and then increments HL
     *
     * @param cpu
     * @returns {number}
     * @private
     */
    _loadAToHLAddressIncrement (cpu) {
        cpu._memory.writeByte(cpu._registers.getHLRegister(), cpu._registers._a);
        cpu._registers.setHLRegister(cpu._registers.getHLRegister() + 1);

        return 2;
    }

    /**
     * (0x23, INC HL) Increment HL register by one
     *
     * @param cpu
     * @returns {number}
     * @private
     */
    _incrementHL (cpu) {
        cpu._registers.setHLRegister(cpu._registers.getHLRegister() + 1);

        return 1;
    }

    /**
     * (0x31, LD SP nn) Loads a word into stack pointer.
     *
     * @param cpu
     * @returns {number}
     * @private
     */
    _loadWordIntoStackPointer (cpu) {
        cpu._registers._stackPointer = cpu._memory.readWord(cpu._registers._programCounter);
        cpu._registers._programCounter += 2;

        return 3;
    }

    /**
     * (0x32, LDD HL A) Loads value of A register into address stored at HL, and then decrements HL
     *
     * @param cpu
     * @returns {number}
     * @private
     */
    _loadAToHLAddressDecrement (cpu) {
        cpu._memory.writeByte(cpu._registers.getHLRegister(), cpu._registers._a);
        cpu._registers.setHLRegister(cpu._registers.getHLRegister() - 1);

        return 2;
    }

    /**
     * (0x33, INC SP) Increment stack pointer by one
     *
     * @param cpu
     * @returns {number}
     * @private
     */
    _incrementStackPointer (cpu) {
        cpu._registers._stackPointer = (cpu._registers._stackPointer + 1) & 65535;

        return 1;
    }

    /**
     * (0x3E, LD A n) Load immediate byte into A register
     *
     * @param cpu
     * @returns {number}
     * @private
     */
    _loadByteIntoA (cpu) {
        cpu._registers._a = cpu._memory.readByte(cpu._registers._programCounter);
        cpu._registers.incrementProgramCounter();

        return 2;
    }

    /**
     * (0x4F LD C A) Copy A register to C register
     *
     * @param cpu
     * @returns {number}
     * @private
     */
    _copyAToC (cpu) {
        cpu._registers._c = cpu._registers._a;

        return 1;
    }

    /**
     * (0x77, LD HL A) Loads value of A register into address stored at HL
     *
     * @param cpu
     * @returns {number}
     * @private
     */
    _loadAToHLAddress (cpu) {
        cpu._memory.writeByte(cpu._registers.getHLRegister(), cpu._registers._a);

        return 2;
    }

    /**
     * (0x80, ADD A B) Add B register to A register
     *
     * @param cpu
     * @returns {number}
     * @private
     */
    _addBToA (cpu) {
        const originalA = cpu._registers._a;
        cpu._registers._a += cpu._registers._b;

        cpu._registers._flags = cpu._registers._a > 255 ?
            CPURegisters.FLAGS.CARRY : CPURegisters.FLAGS.NONE;

        cpu._registers._a &= 255;

        if (cpu._registers._a === 0) {
            cpu._registers._flags |= CPURegisters.FLAGS.ZERO;
        }

        if (CPUOperationMap._isHalfCarry(cpu._registers._a, cpu._registers._b, originalA)) {
            cpu._registers._flags |= CPURegisters.FLAGS.HALF_CARRY;
        }

        return 1;
    }

    /**
     * (0xAF, XOR A) XOR A register against itself and store it (usually used to "zero" the register)
     *
     * @param cpu
     * @returns {number}
     * @private
     */
    _xorA (cpu) {
        cpu._registers._a ^= cpu._registers._a;
        cpu._registers._a &= 255;
        cpu._registers._flags = cpu._registers._a !== 0 ? 0 : 0x80;

        return 1;
    }

    /**
     * (0xC1, POP BC) Pop word from stack and store in BC
     *
     * @param cpu
     * @returns {number}
     * @private
     */
    _popStackToBC (cpu) {
        cpu._registers._c = cpu._memory.readByte(cpu._registers._stackPointer);
        cpu._registers._stackPointer++;
        cpu._registers._b = cpu._memory.readByte(cpu._registers._stackPointer);
        cpu._registers._stackPointer++;

        return 3;
    }

    /**
     * (0xC5, PUSH BC) Push BC 16-bit register to stack
     *
     * @param cpu
     * @returns {number}
     * @private
     */
    _pushBCToStack (cpu) {
        cpu._registers._stackPointer--;
        cpu._memory.writeByte(cpu._registers._stackPointer, cpu._registers._b);
        cpu._registers._stackPointer--;
        cpu._memory.writeByte(cpu._registers._stackPointer, cpu._registers._c);

        return 4;
    }

    /**
     * (0xCB, EXT n) Execute the next byte as an extended operation
     *
     * @param cpu
     * @returns {number}
     * @private
     */
    _extensionOperation (cpu) {
        const extendedOperationCode = cpu._memory.readByte(cpu._registers._programCounter);

        cpu._registers.incrementProgramCounter();
        cpu._registers.maskProgramCounter();

        const extendedOperation = this._extendedOperationMap[extendedOperationCode];

        if (!extendedOperation) {
            throw Error('Undefined ***EXTENDED*** operation code: ' + extendedOperationCode);
        }

        // console.log(extendedOperation);

        return extendedOperation(cpu);
    }

    /**
     * (0xCD, CALL nn) Call routine at 16 bit address
     *
     * @param cpu
     * @returns {number}
     * @private
     */
    _callRoutineAtWord (cpu) {
        cpu._registers._stackPointer -= 2;
        cpu._memory.writeWord(cpu._registers._stackPointer, cpu._registers._programCounter + 2);
        cpu._registers._programCounter = cpu._memory.readWord(cpu._registers._programCounter);

        return 5;
    }

    /**
     * (0xC9, RET) Return from a function call by setting program counter to address at top of stack
     *
     * @param cpu
     * @returns {number}
     * @private
     */
    _return (cpu) {
        cpu._registers._programCounter = cpu._memory.readWord(cpu._registers._stackPointer);
        cpu._registers._stackPointer += 2;

        return 4;
    }

    /**
     * (0xE0, LDH n A) Load A into immediate+offset location
     *
     * @param cpu
     * @returns {number}
     * @private
     */
    _loadAIntoOffsetImmediate (cpu) {
        const writeLocation = 0xFF00 + cpu._memory.readByte(cpu._registers._programCounter);

        cpu._memory.writeByte(writeLocation, cpu._registers._a);
        cpu._registers.incrementProgramCounter();

        return 3;
    }

    /**
     * (0xE2, LDH (C) A) Load A into C+offset location
     *
     * @param cpu
     * @returns {number}
     * @private
     */
    _loadAIntoOffsetC (cpu) {
        cpu._memory.writeByte(0xFF00 + cpu._registers._c, cpu._registers._a);

        return 2;
    }

    /**
     * (0xFE, CP n) Subtract n from A that doesn't update A, only the flags it would have set/reset if it really was subtracted.
     *
     * @param cpu
     * @returns {number}
     * @private
     */
    _compareByteToA (cpu) {
        let accumulatorCopy = cpu._registers._a;
        let n = cpu._memory.readByte(cpu._registers._programCounter);
        accumulatorCopy -= n;

        cpu._registers.incrementProgramCounter();
        cpu._registers._flags = accumulatorCopy < 0 ?
            (CPURegisters.FLAGS.CARRY + CPURegisters.FLAGS.SUBTRACTION) : CPURegisters.FLAGS.SUBTRACTION;

        accumulatorCopy &= 255;

        if (accumulatorCopy === 0) {
            cpu._registers._flags |= CPURegisters.FLAGS.ZERO;
        }

        if (CPUOperationMap._isHalfCarry(cpu._registers._a, n, accumulatorCopy)) {
            cpu._registers._flags |= CPURegisters.FLAGS.HALF_CARRY;
        }

        return 2;
    }

    /**
     * (0xCB11, RL C) Rotate C left, and store 7th bit of original C in carry flag
     *
     * @param cpu
     * @returns {number}
     * @private
     */
    _rotateCLeft (cpu) {
        const cRight = cpu._registers.isCarryFlagSet() ? 1 : 0;
        const rotateWillCarry = cpu._registers._c & 0x80 > 0;

        cpu._registers._c = (cpu._registers._c << 1) + cRight;
        cpu._registers._c &= 255;

        cpu._registers._flags = cpu._registers._c === 0 ?
            CPURegisters.FLAGS.ZERO : CPURegisters.FLAGS.NONE;

        if (rotateWillCarry) {
            cpu._registers._flags |= CPURegisters.FLAGS.CARRY;
        }

        return 2;
    }

    /**
     * (0xCB7C, BIT 7 H) Test bit 7 on register H and store result as Zero flag
     *
     * @param cpu
     * @returns {number}
     * @private
     */
    _testBit7FromH (cpu) {
        cpu._registers._flags &= 0x1F;
        cpu._registers._flags |= (cpu._registers._h & 0x80) > 0 ?
            CPURegisters.FLAGS.HALF_CARRY : CPURegisters.FLAGS.HALF_CARRY + CPURegisters.FLAGS.ZERO;

        return 2;
    }
}

export default CPUOperationMap;
