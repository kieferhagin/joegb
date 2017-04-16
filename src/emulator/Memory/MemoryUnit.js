import MemoryRegion from './MemoryRegion.js';
import MemoryBIOS from "./MemoryBIOS";
import MemoryROM from "./MemoryROM";
import MemoryVRAM from "./MemoryVRAM";

class MemoryUnit {
    _isInBIOS = true;

    _bios = new MemoryBIOS();
    _workingRAM = new MemoryRegion(8192, 0x1FFF);
    //_externalRAM = [];
    _zeroPageRAM = new MemoryRegion(127, 0x7F);
    _videoRAM = new MemoryVRAM();
    _rom = null;

    constructor (rom=new MemoryROM(new Array(0xFFFF).fill(0))) {
        this._rom = rom;
        this._videoRAM._data.fill(1);
    }

    reset () {
        this._isInBIOS = true;

        this._bios.reset();
        this._workingRAM.reset();
        this._zeroPageRAM.reset();
        this._rom.reset();
    }

    readByte (address) {
        const regionAddress = address & 0xF000;

        switch (regionAddress) {
            case 0x0000: // ROM, bank 0 OR BIOS
                if (this._isInBIOS && address <= this._bios.getSizeInBytes()) {
                    return this._readByteBIOS(address);
                }

                return this._readByteROMBank0(address);
            case 0x1000: // ROM, bank 0
            case 0x2000:
            case 0x3000:
                return this._readByteROMBank0(address);
            case 0x4000: // ROM, bank 1
            case 0x5000:
            case 0x6000:
            case 0x7000:
                return this._readByteROMBank1(address);
            case 0x8000: // GPU RAM (VRAM)
            case 0x9000:
                return this._readByteVideoRAM(address);
            case 0xA000: // External RAM (ERAM)
            case 0xB000:
                debugger;
                return 0; // TODO: (UPGRADE FROM TETRIS) make reading from external RAM work
            case 0xC000:
            case 0xD000:
            case 0xE000: // Working RAM (WRAM)
                return this._readByteWorkingRAM(address);
            case 0xF000: // Everything else
                // Echo RAM
                switch (address & 0x0F00) {
                    case 0x000:
                    case 0x100:
                    case 0x200:
                    case 0x300:
                    case 0x400:
                    case 0x500:
                    case 0x600:
                    case 0x700:
                    case 0x800:
                    case 0x900:
                    case 0xA00:
                    case 0xB00:
                    case 0xC00:
                    case 0xD00:
                        return this._readByteWorkingRAM(address);

                    // OAM
                    case 0xE00:
                        debugger;
                        return 0; // TODO (gpu) get reading from OAM working

                    // Zero-page RAM, I/O, interrupts
                    case 0xF00:
                        if (address === 0xFFFF) {
                            debugger;
                            // TODO: get interrupts working
                            return 0;
                        }

                        if (address > 0xFF7F) {
                            return this._readByteZeroPageRAM(address);
                        }

                        switch (address & 0xF0) {
                            case 0x00:
                                switch(address & 0xF) {
                                    case 0:
                                        debugger;
                                        return 0; // TODO: get inputs working
                                    case 4:
                                    case 5:
                                    case 6:
                                    case 7:
                                        debugger;
                                        return 0; // TODO: get timers working
                                    case 15:
                                        debugger;
                                        return 0; // TODO: return interrupt flags
                                    default:
                                        debugger;
                                        return 0;
                                }
                            case 0x10:
                            case 0x20:
                            case 0x30:
                                return 0;
                            case 0x40:
                            case 0x50:
                            case 0x60:
                            case 0x70:
                                debugger;
                                return 0; // TODO: get GPU WORKING
                        }
                }
        }
    }

    _readByteBIOS (address) {
        if (address === this._bios.getSizeInBytes()) {
            console.log('Leaving BIOS');
            this._isInBIOS = false;
            return this._readByteROMBank0(address);
        }

        return this._bios.readByte(address);
    }

    _readByteROMBank0 (address) {
        return this._rom.readByte(address);
    }

    _readByteROMBank1 (address) {
        return this._rom.readByte(address);
    }

    _readByteVideoRAM (address) {
        return this._videoRAM.readByte(address);
    }

    _readByteWorkingRAM (address) {
        return this._workingRAM.readByte(address);
    }

    _readByteZeroPageRAM (address) {
        return this._zeroPageRAM.readByte(address);
    }

    writeByte (address, value) {
        switch (address & 0xF000) {
            // ROM bank 0
            // MBC1: Turn external RAM on
            case 0x0000:
            case 0x1000:
                debugger;
                break; // TODO: (UPGRADE FROM TETRIS) make turning on external RAM work

            // MBC1: ROM bank switch
            case 0x2000:
            case 0x3000:
                debugger;
                break; // TODO: (UPGRADE FROM TETRIS) make ROM bank switching work

            // ROM bank 1
            // MBC1: RAM bank switch
            case 0x4000:
            case 0x5000:
                debugger;
                break; // TODO: (UPGRADE FROM TETRIS) make RAM bank switching work

            // MBC mode switching
            case 0x6000:
            case 0x7000:
                debugger;
                break; // TODO: (UPGRADE FROM TETRIS) make MBC mode switching work

            // VRAM
            case 0x8000:
            case 0x9000:
                return this._videoRAM.writeByte(address, value);

            // External RAM
            case 0xA000:
            case 0xB000:
                debugger;
                break; // TODO: (UPGRADE FROM TETRIS) make external RAM writing work

            // Working RAM and echo
            case 0xC000:
            case 0xD000:
            case 0xE000:
                return this._workingRAM.writeByte(address, value);

            // Everything else
            case 0xF000:
                switch (address & 0x0F00) {
                    // Echo RAM
                    case 0x000:
                    case 0x100:
                    case 0x200:
                    case 0x300:
                    case 0x400:
                    case 0x500:
                    case 0x600:
                    case 0x700:
                    case 0x800:
                    case 0x900:
                    case 0xA00:
                    case 0xB00:
                    case 0xC00:
                    case 0xD00:
                        return this._workingRAM.writeByte(address, value);
                    //OAM
                    case 0xE00:
                        break; // TODO: (SETUP GPU) make writing to OAM work
                    // Zero-page RAM, I/O, interrupts
                    case 0xF00:
                        if (address === 0xFFFF) {
                            debugger;
                            // TODO: (adding interrupts) enable interrupts
                            return;
                        }

                        if (address > 0xFF7F) {
                            return this._zeroPageRAM.writeByte(address, value);
                        }

                        // TODO: inputs, GPU writes, timer writes
                        debugger;
                }
        }
    }

    readWord (address) {
        return this.readByte(address) + ((this.readByte(address + 1)) << 8);
    }

    writeWord (address, value) {

    }
}

export default MemoryUnit;
