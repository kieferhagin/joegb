const chai = require('chai');
const spies = require('chai-spies');
const MemoryRegion = require('../../Memory/MemoryRegion.js').default;

chai.use(spies);

const should = chai.should();
const expect = chai.expect;

const defaultMemoryLength = 10000;
const defaultOffsetMask = 0xFFFF;

let memoryRegion = null;

describe('MemoryRegion', () => {
    beforeEach (() => {
        memoryRegion = new MemoryRegion(defaultMemoryLength, defaultOffsetMask);
    });

    describe('construct', () => {
        it('should create a buffer of n length filled with 0\'s', () => {
            expect(memoryRegion._data.length).to.be.equal(defaultMemoryLength);
            expect(memoryRegion._data.reduce((acc, val) => {
                acc += val;
                return acc;
            }, 0)).to.be.equal(0);
        });

        it('should use existing data if passed in', () => {
            memoryRegion = new MemoryRegion(defaultMemoryLength, defaultOffsetMask, [1, 2, 3]);
            expect(memoryRegion._data[0]).to.be.equal(1);
            expect(memoryRegion._data[1]).to.be.equal(2);
            expect(memoryRegion._data[2]).to.be.equal(3);
        });

        it('should set offset mask', () => {
            memoryRegion = new MemoryRegion(defaultMemoryLength, 0xFF1F);
            expect(memoryRegion._offsetMask).to.be.equal(0xFF1F);
        });
    });

    describe('reset', () => {
        it('should reset to all 0\'s by default', () => {
            memoryRegion._data[0] = 1;
            memoryRegion._data[1] = 2;
            memoryRegion._data[2] = 3;
            memoryRegion._data[3] = 4;

            memoryRegion.reset();

            expect(memoryRegion._data.reduce((acc, val) => {
                acc += val;
                return acc;
            }, 0)).to.be.equal(0);

            expect(memoryRegion._data.length).to.be.equal(defaultMemoryLength);
        });

        it('should reset memory to existing data if passed in', () => {
            memoryRegion = new MemoryRegion(defaultMemoryLength, defaultOffsetMask, [1, 2, 3]);

            memoryRegion.reset();

            expect(memoryRegion._data[0]).to.be.equal(1);
            expect(memoryRegion._data[1]).to.be.equal(2);
            expect(memoryRegion._data[2]).to.be.equal(3);
        });
    });

    describe('readByte', () => {
        it('should read a stored byte', () => {
            memoryRegion._data[0] = 12;

            expect(memoryRegion.readByte(0)).to.be.equal(12);
        });

        it('should use offset', () => {
            memoryRegion._offsetMask = 0x1FFF;
            memoryRegion._data[1] = 12;

            expect(memoryRegion.readByte(8193)).to.be.equal(12);
        });
    });

    describe('writeByte', () => {
        it('should write a byte', () => {
            memoryRegion.writeByte(10, 75);
            expect(memoryRegion.readByte(10)).to.be.equal(75);
        });

        it('should use offset', () => {
            memoryRegion._offsetMask = 0x1FFF;
            memoryRegion.writeByte(8193, 75);

            expect(memoryRegion.readByte(8193)).to.be.equal(75);
            expect(memoryRegion._data[1]).to.be.equal(75);
        });
    });

    describe('writeWord', () => {
        it('should write a word', () => {
            memoryRegion.writeWord(1, 400);

            expect(memoryRegion.readWord(1)).to.be.equal(400);
        });

        it('should use offset', () => {
            memoryRegion._offsetMask = 0x1FFF;
            memoryRegion.writeWord(8193, 400);

            expect(memoryRegion.readWord(8193)).to.be.equal(400);
        });
    });

    describe('readWord', () => {
        it('should read a stored word', () => {
            memoryRegion.writeWord(0, 400);

            expect(memoryRegion.readWord(0)).to.be.equal(400);
        });

        it('should use offset', () => {
            memoryRegion._offsetMask = 0x1FFF;
            memoryRegion.writeWord(1, 400);

            expect(memoryRegion.readWord(8193)).to.be.equal(400);
        });
    });

    describe('get region size', () => {
        it('should return length of backing data array', () => {
            expect(memoryRegion.getSizeInBytes()).to.be.equal(memoryRegion._data.length);
        });
    });
});