const chai = require('chai');
const spies = require('chai-spies');
const GPUTile = require('../../GPU/GPUTile.js').default;

chai.use(spies);

const should = chai.should();
const expect = chai.expect;

let tile = null;

describe('GPUTile', () => {
    beforeEach (() => {
        tile = new GPUTile();
    });

    describe('construct', () => {
        it('should call reset', () => {
            let spy = chai.spy.on(GPUTile.prototype, 'reset');
            tile = new GPUTile();

            spy.should.have.been.called();
        });
    });

    describe('reset', () => {
        it('should create 8x8 2D array', () => {
            tile.reset();

            expect(tile._data.length).to.be.equal(8);
            expect(tile._data.every(row => row.length === 8)).to.be.equal(true);
        });

        it('should set each element to 0', () => {
            tile.reset();

            expect(tile._data.every(row => row.every(element => element === 0))).to.be.equal(true);
        });
    });

    describe('update tile pixel', () => {
        it('should set tile value to value', () => {
            tile.update(5, 4, 1);

            expect(tile._data[4][5]).to.be.equal(1);
        });
    });

    describe('get tile pixel', () => {
        it('should return tile pixel', () => {
            tile.update(5, 4, 1);

            expect(tile.getPixel(5, 4)).to.be.equal(tile._data[4][5]);
        });
    });
});