import CPU from "./CPU/CPU";
import MemoryUnit from "./Memory/MemoryUnit";
import GPU from "./GPU/GPU";

class GameBoy {
    _rom = null;

    constructor () {

    }

    loadROM (memoryROM) {
        this._rom = memoryROM;
    }

    start () {
        if (!this._rom) {
            throw Error('Cannot start GameBoy without a loaded ROM!');
        }

        // const cpu = new CPU(new MemoryUnit(this._rom));
        // cpu.start();

        const gpu = new GPU();

        setInterval(() => {
            gpu.step(40);
            console.log('Mode: ' + gpu._mode + ', Line: ' + gpu._currentLine);
        }, 100);
    }
}

export default GameBoy;
