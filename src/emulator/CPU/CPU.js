import CPUClock from './CPUClock.js';
import CPURegisters from './CPURegisters.js';
import CPUOperationMap from './CPUOperationMap.js';

class CPU {
    _clock = null;
    _registers = null;
    _operationMap = null;
    _memory = null;

    _stop = false;

    constructor (memoryUnit) {
        this._clock = new CPUClock();
        this._registers = new CPURegisters();
        this._operationMap = new CPUOperationMap();
        this._memory = memoryUnit;
    }

    reset () {
        this._clock.reset();
        this._registers.reset();
        this._memory.reset();
    }

    step () {
        let nextOperation = () => {};

        try {
            nextOperation = this._getNextOperation();
        } catch (e) {
            this._stop = true;
            throw e;
        }

        const clockTicks = nextOperation(this);

        this._registers.maskProgramCounter();
        this._clock.tick(clockTicks);

        return nextOperation;
    }

    _getNextOperation () {
        const operationLocation = this._registers.incrementProgramCounter();
        const operationCode = this._memory.readByte(operationLocation);

        return this._operationMap.getOperation(operationCode);
    }
}

export default CPU;
