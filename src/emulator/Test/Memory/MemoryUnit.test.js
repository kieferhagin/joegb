const chai = require('chai');
const spies = require('chai-spies');
const MemoryUnit = require('../../Memory/MemoryUnit.js').default;

chai.use(spies);

const should = chai.should();
const expect = chai.expect;

let memoryUnit = null;

describe('MemoryUnit', () => {
    beforeEach (() => {
        memoryUnit = new MemoryUnit();
    });

    describe('reset', () => {
        it('should reset BIOS', () => {
            let spy = chai.spy.on(memoryUnit._bios, 'reset');
            memoryUnit.reset();
            spy.should.have.been.called();
        });

        it('should reset WRAM', () => {
            let spy = chai.spy.on(memoryUnit._workingRAM, 'reset');
            memoryUnit.reset();
            spy.should.have.been.called();
        });

        it('should reset zero-page RAM', () => {
            let spy = chai.spy.on(memoryUnit._zeroPageRAM, 'reset');
            memoryUnit.reset();
            spy.should.have.been.called();
        });

        it('should reset ROM', () => {
            let spy = chai.spy.on(memoryUnit._rom, 'reset');
            memoryUnit.reset();
            spy.should.have.been.called();
        });

        it('should set BIOS flag back to true', () => {
            memoryUnit._isInBIOS = false;
            memoryUnit.reset();

            expect(memoryUnit._isInBIOS).to.be.equal(true);
        });
    });

    describe('read byte', () => {
        it('should read byte from BIOS if address is in BIOS and BIOS is still loaded', () => {
            let spy = chai.spy.on(memoryUnit, '_readByteBIOS');
            memoryUnit.readByte(0);
            spy.should.have.been.called();
        });

        it('should read byte from ROM if address is in ROM and BIOS is NOT loaded', () => {
            let spy = chai.spy.on(memoryUnit, '_readByteROMBank0');
            memoryUnit._isInBIOS = false;
            memoryUnit.readByte(0);
            spy.should.have.been.called();
        });

        it('should disable BIOS if BIOS is loaded and we are now outside BIOS', () => {
            memoryUnit._rom.writeByte(256, 75);
            const output = memoryUnit.readByte(256);

            expect(memoryUnit._isInBIOS).to.be.equal(false);
            expect(output).to.be.equal(75);
        });

        it('should read byte from ROM if outside BIOS and in ROM area', () => {
            memoryUnit._rom.writeByte(0x1001, 75);
            let output = memoryUnit.readByte(0x1001);

            expect(output).to.be.equal(75);

            memoryUnit._rom.writeByte(0x2001, 75);
            output = memoryUnit.readByte(0x2001);

            expect(output).to.be.equal(75);

            memoryUnit._rom.writeByte(0x3001, 75);
            output = memoryUnit.readByte(0x3001);

            expect(output).to.be.equal(75);

            memoryUnit._rom.writeByte(0x4001, 75);
            output = memoryUnit.readByte(0x4001);

            expect(output).to.be.equal(75);

            memoryUnit._rom.writeByte(0x5001, 75);
            output = memoryUnit.readByte(0x5001);

            expect(output).to.be.equal(75);

            memoryUnit._rom.writeByte(0x6001, 75);
            output = memoryUnit.readByte(0x6001);

            expect(output).to.be.equal(75);

            memoryUnit._rom.writeByte(0x7001, 75);
            output = memoryUnit.readByte(0x7001);

            expect(output).to.be.equal(75);
        });

        it('should read byte from video RAM', () => {
            memoryUnit._videoRAM.writeByte(0x8001, 75);
            let output = memoryUnit.readByte(0x8001);

            expect(output).to.be.equal(75);

            memoryUnit._videoRAM.writeByte(0x9001, 75);
            output = memoryUnit.readByte(0x9001);

            expect(output).to.be.equal(75);
        });

        it('should read byte from working RAM', () => {
            memoryUnit._workingRAM.writeByte(0xC001, 75);
            let output = memoryUnit.readByte(0xC001);

            expect(output).to.be.equal(75);

            memoryUnit._workingRAM.writeByte(0xD001, 75);
            output = memoryUnit.readByte(0xD001);

            expect(output).to.be.equal(75);

            memoryUnit._workingRAM.writeByte(0xE001, 75);
            output = memoryUnit.readByte(0xE001);

            expect(output).to.be.equal(75);
        });

        it('should read byte from working RAM echo', () => {
            memoryUnit._workingRAM.writeByte(0xF000, 75);
            let output = memoryUnit.readByte(0xF000);

            expect(output).to.be.equal(75);

            memoryUnit._workingRAM.writeByte(0xF100, 75);
            output = memoryUnit.readByte(0xF100);

            expect(output).to.be.equal(75);

            memoryUnit._workingRAM.writeByte(0xF200, 75);
            output = memoryUnit.readByte(0xF200);

            expect(output).to.be.equal(75);

            memoryUnit._workingRAM.writeByte(0xF300, 75);
            output = memoryUnit.readByte(0xF300);

            expect(output).to.be.equal(75);

            memoryUnit._workingRAM.writeByte(0xF400, 75);
            output = memoryUnit.readByte(0xF400);

            expect(output).to.be.equal(75);

            memoryUnit._workingRAM.writeByte(0xF500, 75);
            output = memoryUnit.readByte(0xF500);

            expect(output).to.be.equal(75);

            memoryUnit._workingRAM.writeByte(0xF600, 75);
            output = memoryUnit.readByte(0xF600);

            expect(output).to.be.equal(75);

            memoryUnit._workingRAM.writeByte(0xF700, 75);
            output = memoryUnit.readByte(0xF700);

            expect(output).to.be.equal(75);

            memoryUnit._workingRAM.writeByte(0xF800, 75);
            output = memoryUnit.readByte(0xF800);

            expect(output).to.be.equal(75);

            memoryUnit._workingRAM.writeByte(0xF900, 75);
            output = memoryUnit.readByte(0xF900);

            expect(output).to.be.equal(75);

            memoryUnit._workingRAM.writeByte(0xFA00, 75);
            output = memoryUnit.readByte(0xFA00);

            expect(output).to.be.equal(75);

            memoryUnit._workingRAM.writeByte(0xFB00, 75);
            output = memoryUnit.readByte(0xFB00);

            expect(output).to.be.equal(75);

            memoryUnit._workingRAM.writeByte(0xFC00, 75);
            output = memoryUnit.readByte(0xFC00);

            expect(output).to.be.equal(75);

            memoryUnit._workingRAM.writeByte(0xFD00, 75);
            output = memoryUnit.readByte(0xFD00);

            expect(output).to.be.equal(75);
        });

        it('should read from zero-page ram', () => {
            memoryUnit._zeroPageRAM.writeByte(0xFF80, 75);
            let output = memoryUnit.readByte(0xFF80);

            expect(output).to.be.equal(75);
        });
    });

    describe('read word', () => {
        it('should read a word', () => {
            memoryUnit._rom.writeWord(4000, 400);
            expect(memoryUnit.readWord(4000)).to.be.equal(400);
        });
    });

    describe('write byte', () => {
        it('should write to vram', () => {
            memoryUnit.writeByte(0x8001, 75);
            expect(memoryUnit._videoRAM.readByte(0x8001)).to.be.equal(75);

            memoryUnit.writeByte(0x9001, 75);
            expect(memoryUnit._videoRAM.readByte(0x9001)).to.be.equal(75);
        });

        it('should write byte to working RAM', () => {
            memoryUnit.writeByte(0xC001, 75);
            expect(memoryUnit._workingRAM.readByte(0xC001)).to.be.equal(75);

            memoryUnit.writeByte(0xD001, 75);
            expect(memoryUnit._workingRAM.readByte(0xD001)).to.be.equal(75);

            memoryUnit.writeByte(0xE001, 75);
            expect(memoryUnit._workingRAM.readByte(0xE001)).to.be.equal(75);

            memoryUnit.writeByte(0xF001, 75);
            expect(memoryUnit._workingRAM.readByte(0xF001)).to.be.equal(75);
        });

        it('should write byte to zero page RAM', () => {
            memoryUnit.writeByte(0xFF80, 75);
            expect(memoryUnit._zeroPageRAM.readByte(0xFF80)).to.be.equal(75);
        });
    });
});