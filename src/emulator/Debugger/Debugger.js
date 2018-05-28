class Debugger {
    _gameBoy = null;

    constructor (gameBoy) {
        this._gameBoy = gameBoy;
    }

    attach () {
        let tempStep = this._gameBoy._cpu.step.bind(this._gameBoy._cpu);

        this._gameBoy._cpu.step = () => {
            const lastOp = tempStep();

            this._logHeader('Last operation');
            this._logFunction(lastOp);
            this._logCPURegisters();
            this._logStack();
        };
    }

    _logCPURegisters () {
        this._logHeader('CPU registers');
        console.log(this._gameBoy._cpu._registers);
    }

    _logStack () {
        this._logHeader('Stack');
        const stackPointer = this._gameBoy._cpu._registers._stackPointer;
        const bottomOfStack = this._gameBoy._cpu._registers._stackPointer + 5;

        console.log('* ' + stackPointer + ' - ' + this._gameBoy._cpu._memory._readByteZeroPageRAM(stackPointer));

        for (let i = stackPointer + 1; i < bottomOfStack; i++) {
            console.log(i.toString() + ' - ' + this._gameBoy._cpu._memory._readByteZeroPageRAM(i));
        }
    }

    _logHeader (text) {
        console.log('--- ' + text + ' ---');
    }

    _logFunction (lastOp) {
        console.log('Function name: ' + lastOp.name);
    }
}

export default Debugger;
