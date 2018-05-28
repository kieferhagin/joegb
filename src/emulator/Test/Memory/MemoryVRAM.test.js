const chai = require('chai');
const spies = require('chai-spies');
const MemoryVRAM = require('../../Memory/MemoryVRAM.js').default;

chai.use(spies);

const should = chai.should();
const expect = chai.expect;

let vram = null;

describe('MemoryVRAM', () => {
    beforeEach (() => {
        vram = new MemoryVRAM();
    });

    describe('construct', () => {

    });

    describe('reset', () => {
        it('should reset to all 0\'s by default', () => {
            vram._data[0] = 1;
            vram._data[1] = 2;
            vram._data[2] = 3;
            vram._data[3] = 4;

            vram.reset();

            expect(vram._data.reduce((acc, val) => {
                acc += val;
                return acc;
            }, 0)).to.be.equal(0);
        });

        it('should reset all tiles', () => {
            let spies = [
                chai.spy.on(vram._tileset[0], 'reset'),
                chai.spy.on(vram._tileset[vram._tileset.length - 1], 'reset')
            ];

            vram.reset();

            for (let i = 0; i < spies.length; i++) {
                spies[i].should.have.been.called();
            }
        });
    });

    describe('writeByte', () => {
        it('should write a byte', () => {
            vram.writeByte(10, 75);
            expect(vram.readByte(10)).to.be.equal(75);
        });

        it('should use offset', () => {
            vram._offsetMask = 0x1FFF;
            vram.writeByte(8193, 75);

            expect(vram.readByte(8193)).to.be.equal(75);
            expect(vram._data[1]).to.be.equal(75);
        });
    });

    describe('writeWord', () => {
        it('should write a word', () => {
            vram.writeWord(1, 400);

            expect(vram.readWord(1)).to.be.equal(400);
        });

        it('should use offset', () => {
            vram._offsetMask = 0x1FFF;
            vram.writeWord(8193, 400);

            expect(vram.readWord(8193)).to.be.equal(400);
        });
    });

    describe('update tile', () => {
        it('should update correct tile', () => {
            let spy = chai.spy.on(vram._tileset[500], 'update');
            vram._updateTile(8000);

            spy.should.have.been.called.exactly(vram._tileset[500]._data[0].length);
        });

        it('should update correct row', () => {
            let spy = chai.spy.on(vram._tileset[506], 'update');
            vram._updateTile(8100);

            spy.should.have.been.called.with.exactly(0, 2, 0);
        });

        it('should update with correct value', () => {
            vram.writeByte(8100, 0b11000000);
            vram.writeByte(8101, 0b10000001);

            let spy = chai.spy.on(vram._tileset[506], 'update');
            vram._updateTile(8100);

            spy.should.have.been.called.with.exactly(0, 2, 3);
            spy.should.have.been.called.with.exactly(1, 2, 1);
            spy.should.have.been.called.with.exactly(7, 2, 2);
        });

        it('should back up one address if we are writing an odd numbered address', () => {
            vram.writeByte(8100, 0b11000000);
            vram.writeByte(8101, 0b10000001);

            let spy = chai.spy.on(vram._tileset[506], 'update');
            vram._updateTile(8101);

            spy.should.have.been.called.with.exactly(0, 2, 3);
            spy.should.have.been.called.with.exactly(1, 2, 1);
            spy.should.have.been.called.with.exactly(7, 2, 2);
        })
    });
});