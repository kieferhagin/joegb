import CPU from "./CPU/CPU";
import MemoryUnit from "./Memory/MemoryUnit";
import GPU from "./GPU/GPU";
import Debugger from "./Debugger/Debugger";

class GameBoy {
    _rom = null;
    _cpu = null;
    _gpu = null;
    _debugger = null;

    constructor () {

    }

    loadROM (memoryROM) {
        this._rom = memoryROM;
    }

    start (canvas=null) {
        if (!this._rom) {
            throw Error('Cannot start GameBoy without a loaded ROM!');
        }

        const memoryUnit = new MemoryUnit(this._rom);

        this._cpu = new CPU(memoryUnit);
        this._gpu = new GPU(memoryUnit);
        if (canvas) {
            this._gpu._screen.setCanvas(canvas);
        }
        // this._debugger = new Debugger(this);
        // this._debugger.attach();
        this.executeFrame();



        // const gpu = new GPU();
        //
        // setInterval(() => {
        //     gpu.step(40);
        //     console.log('Mode: ' + gpu._mode + ', Line: ' + gpu._currentLine);
        // }, 100);

        window.gameboy = this;
    }

    executeFrame () {
        const pauseAt = this._cpu._clock.getBaseValue() + (17556 * 100);

        while (this._cpu._clock.getBaseValue() < pauseAt && !this._cpu._stop) {
            this._cpu.step();
            this._gpu.step();
        }

        debugger;
    }
}

export default GameBoy;
