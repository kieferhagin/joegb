import MemoryRegion from "./MemoryRegion";

class MemoryVRAM extends MemoryRegion {
    constructor () {
        super(8192, 0x1FFF);
    }
}

export default MemoryVRAM;
