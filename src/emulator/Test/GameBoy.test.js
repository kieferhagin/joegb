const chai = require('chai');
const spies = require('chai-spies');
const GameBoy = require('../GameBoy.js').default;
const MemoryROM = require('../Memory/MemoryROM.js').default;

chai.use(spies);

const should = chai.should();
const expect = chai.expect;

const defaultMemoryLength = 10000;
const defaultOffsetMask = 0xFFFF;

let gameboy = null;

describe('GameBoy', () => {
    beforeEach (() => {
        gameboy = new GameBoy();
    });

    describe('load ROM', () => {
        it('should set ROM to param', () => {
            const expectedMemoryROM = new MemoryROM(new Array(0x0FFFF));
            gameboy.loadROM(expectedMemoryROM);

            expect(gameboy._rom).to.be.equal(expectedMemoryROM);
        });
    });

    describe('start', () => {
        it('should raise an exception if ROM is not set', () => {
            expect(gameboy.start).to.throw(Error);
        });
    });
});