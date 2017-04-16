import MemoryRegion from './MemoryRegion.js';

class MemoryROM extends MemoryRegion {
    static CARTRIDGE_TYPES = {
        ROM_ONLY: 0,
        MBC1: 1,
        MBC1_RAM: 2,
        MBC1_RAM_BATTERY: 3,
        MBC2: 5,
        MBC2_BATTERY: 6,
        ROM_RAM: 8,
        ROM_RAM_BATTERY: 9,
        MMM01: 0xB,
        MMM01_RAM: 0xC,
        MMM01_RAM_BATTERY: 0xD,
        MBC3_TIMER_BATTERY: 0XF,
        MBC3_TIMER_RAM_BATTERY: 0x10,
        MBC3: 0x11,
        MBC3_RAM: 0x12,
        MBC3_RAM_BATTERY: 0x13,
        MBC4: 0x15,
        MBC4_RAM: 0x16,
        MBC4_RAM_BATTERY: 0x17,
        MBC5: 0x19,
        MBC5_RAM: 0x1A,
        MBC5_RAM_BATTERY: 0x1B,
        MBC5_RUMBLE: 0x1C,
        MBC5_RUMBLE_RAM: 0x1D,
        MBC5_RUMBLE_RAM_BATTERY: 0x1E,
        MBC6: 0x20,
        MBC7_SENSOR_RUMBLE_RAM_BATTERY: 0x22,

        POCKET_CAMERA: 0xFC,
        BANDAI_TAMA5: 0xFD,
        HUC3: 0xFE,
        HUC1_RAM_BATTERY: 0xFF
    };

    static ROM_SIZES = {
        KBYTE_32: 0,
        KBYTE_64: 1,
        KBYTE_128: 2,
        KBYTE_256: 3,
        KBYTE_512: 4,
        MBYTE_1: 5,
        MBYTE_2: 6,
        MBYTE_4: 7,
        MBYTE_8: 8,
        MBYTE_1_1: 0x52,
        MBYTE_1_2: 0x53,
        MBYTE_1_5: 0x54
    };

    static EXTERNAL_RAM_SIZES = {
        NONE: 0,
        KBYTE_2: 1,
        KBYTE_8: 2,
        KBYTE_32: 3,
        KBYTE_128: 4,
        KBYTE_64: 5
    };

    constructor (data) {
        super(data.length, 0xFFFF, data);
    }

    getHeaderInfo () {
        return {
            title: this.getGameTitle(),
            nintendoLogo: this.getNintendoLogo(),
            manufacturerCode: this.getManufacturerCode(),
            isColorCompatible: this.getColorCompatablityFlag(),
            licenseeCode: this.getLicenseeCode(),
            hasSuperGameBoyFunctions: this.getSuperGameBoyFlag(),
            cartridgeType: this.getCartridgeType(),
            romSize: this.getCatridgeROMSize(),
            ramSize: this.getCatridgeRAMSize(),
            isJapaneseOnly: this.getDestinationJapanese(),
            versionNumber: this.getVersionNumber(),
            headerChecksum: this.getHeaderChecksum(),
            globalChecksum: this.getGlobalChecksum()
        }
    }

    getGameTitle () {
        return this._data
            .slice(0x0134, 0x013F)
            .toString('ascii');
    }

    getNintendoLogo () {
        return this._data
            .slice(0x0104, 0x0134)
    }

    getManufacturerCode () {
        return this._data
            .slice(0x013F, 0x0142)
            .toString('ascii');
    }

    getColorCompatablityFlag () {
        return this._data[0x0143] > 0;
    }

    getSuperGameBoyFlag () {
        return this._data[0x0146] > 0;
    }

    getCartridgeType () {
        return this._data[0x0147];
    }

    getCatridgeROMSize () {
        return this._data[0x0148];
    }

    getCatridgeRAMSize () {
        return this._data[0x0149];
    }

    getDestinationJapanese () {
        return this._data[0x014A] === 0;
    }

    getLicenseeCode () {
        const value = this._data[0x014B];

        if (value === 0x33) {
            return this._data
                .slice(0x0144, 0x0146)
                .map(hex => String.fromCharCode(97 + hex))
                .join('');
        }

        return value;
    }

    getVersionNumber () {
        return this._data[0x014C];
    }

    getHeaderChecksum () {
        return this._data[0x014D];
    }

    getGlobalChecksum () {
        return this._data.slice(0x014E, 0x0150);
    }
}

export default MemoryROM;
