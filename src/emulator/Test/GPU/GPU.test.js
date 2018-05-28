const chai = require('chai');
const spies = require('chai-spies');
const GPU = require('../../GPU/GPU.js').default;
const MemoryUnit = require('../../Memory/MemoryUnit').default;

chai.use(spies);

const should = chai.should();
const expect = chai.expect;

let gpu = null;

describe('GPU', () => {
    beforeEach (() => {
        gpu = new GPU(new MemoryUnit());
    });

    describe('construct', () => {
        it('should set memory unit', () => {
            const m = new MemoryUnit();
            gpu = new GPU(m);
            expect(gpu._memory).to.be.equal(m);
        });
    });

    describe('reset', () => {
        it('should set mode to horizontal blank', () => {
            gpu._mode = 1;
            gpu.reset();
            expect(gpu._mode).to.be.equal(GPU.MODES.OAM_READ);
        });

        it('should reset clock', () => {
            let spy = chai.spy.on(gpu._clock, 'reset');
            gpu.reset();
            spy.should.have.been.called();
        });

        it('should reset screen', () => {
            let spy = chai.spy.on(gpu._screen, 'reset');
            gpu.reset();
            spy.should.have.been.called();
        });
    });

    describe('step', () => {
        it('should tick the clock', () => {
            let spy = chai.spy.on(gpu._clock, 'tick');
            gpu.step(5);
            spy.should.have.been.called.with(5);
        });

        it('should run hblank mode', () => {
            gpu._mode = GPU.MODES.HORIZONTAL_BLANK;

            let spy = chai.spy.on(gpu, '_horizontalBlank');
            gpu.step(5);
            spy.should.have.been.called();
        });

        it('should run vblank mode', () => {
            gpu._mode = GPU.MODES.VERTICAL_BLANK;

            let spy = chai.spy.on(gpu, '_verticalBlank');
            gpu.step(5);
            spy.should.have.been.called();
        });

        it('should run OAM read mode', () => {
            gpu._mode = GPU.MODES.OAM_READ;

            let spy = chai.spy.on(gpu, '_oamRead');
            gpu.step(5);
            spy.should.have.been.called();
        });

        it('should run VRAM read mode', () => {
            gpu._mode = GPU.MODES.VRAM_READ;

            let spy = chai.spy.on(gpu, '_vramRead');
            gpu.step(5);
            spy.should.have.been.called();
        });
    });

    describe('horizontal blank', () => {
        beforeEach(() => {
            gpu._mode = GPU.MODES.HORIZONTAL_BLANK;
            gpu._clock.tick(52);
        });

        it('should do nothing if it isnt time yet', () => {
            gpu._clock.reset();
            gpu._clock.tick(50);
            gpu._horizontalBlank();

            expect(gpu._memory._gpuRegisters._currentScanLine).to.be.equal(0);
        });

        it('should increase line number by one', () => {
            gpu._horizontalBlank();

            expect(gpu._memory._gpuRegisters._currentScanLine).to.be.equal(1);
        });

        it('should reset clock', () => {
            let spy = chai.spy.on(gpu._clock, 'reset');
            gpu._horizontalBlank();
            spy.should.have.been.called();
        });

        it('should set mode to OAM read', () => {
            gpu._horizontalBlank();
            expect(gpu._mode).to.be.equal(GPU.MODES.OAM_READ);
        });

        describe('horizontal blank complete', () => {
            beforeEach(() => {
                gpu._memory._gpuRegisters._currentScanLine= 143;
            });

            it('should switch to vertical blank mode', () => {
                gpu._horizontalBlank();
                expect(gpu._mode).to.be.equal(GPU.MODES.VERTICAL_BLANK);
            });

            it('should not increase line number', () => {
                gpu._horizontalBlank();
                expect(gpu._memory._gpuRegisters._currentScanLine).to.be.equal(143);
            });
        });
    });

    describe('vertical blank', () => {
        beforeEach(() => {
            gpu._mode = GPU.MODES.VERTICAL_BLANK;
            gpu._clock.tick(115);
        });

        it('should do nothing if it isnt time yet', () => {
            gpu._clock.reset();
            gpu._clock.tick(113);
            gpu._verticalBlank();

            expect(gpu._memory._gpuRegisters._currentScanLine).to.be.equal(0);
        });

        it('should increase line number by one', () => {
            gpu._verticalBlank();

            expect(gpu._memory._gpuRegisters._currentScanLine).to.be.equal(1);
        });

        it('should reset clock', () => {
            let spy = chai.spy.on(gpu._clock, 'reset');
            gpu._verticalBlank();
            spy.should.have.been.called();
        });

        describe('horizontal blank complete', () => {
            beforeEach(() => {
                gpu._memory._gpuRegisters._currentScanLine = 153;
            });

            it('should switch to OAM read mode', () => {
                gpu._verticalBlank();
                expect(gpu._mode).to.be.equal(GPU.MODES.OAM_READ);
            });

            it('should reset line number', () => {
                gpu._verticalBlank();
                expect(gpu._memory._gpuRegisters._currentScanLine).to.be.equal(0);
            });
        });
    });

    describe('OAM read', () => {
        beforeEach(() => {
            gpu._mode = GPU.MODES.OAM_READ;
            gpu._clock.tick(21);
        });

        it('should do nothing if it isnt time yet', () => {
            gpu._clock.reset();
            gpu._clock.tick(19);
            gpu._oamRead();

            expect(gpu._mode).to.be.equal(GPU.MODES.OAM_READ);
        });

        it('should reset clock', () => {
            let spy = chai.spy.on(gpu._clock, 'reset');
            gpu._oamRead();
            spy.should.have.been.called();
        });

        it('should switch to VRAM read mode', () => {
            gpu._oamRead();
            expect(gpu._mode).to.be.equal(GPU.MODES.VRAM_READ);
        });
    });

    describe('VRAM read', () => {
        beforeEach(() => {
            gpu._mode = GPU.MODES.VRAM_READ;
            gpu._clock.tick(44);
        });

        it('should do nothing if it isnt time yet', () => {
            gpu._clock.reset();
            gpu._clock.tick(42);
            gpu._vramRead();

            expect(gpu._mode).to.be.equal(GPU.MODES.VRAM_READ);
        });

        it('should reset clock', () => {
            let spy = chai.spy.on(gpu._clock, 'reset');
            gpu._vramRead();
            spy.should.have.been.called();
        });

        it('should switch to horizontal blank mode', () => {
            gpu._vramRead();
            expect(gpu._mode).to.be.equal(GPU.MODES.HORIZONTAL_BLANK);
        });

        it('should render scan line', () => {
            let spy = chai.spy.on(gpu, '_renderScanLine');
            gpu._vramRead();
            spy.should.have.been.called();
        });
    });

    describe('render scan line', () => {
        it('should do nothing if display is disabled', () => {
            gpu._memory._gpuRegisters._displayEnabled = false;

            let spy = chai.spy.on(gpu._memory._gpuRegisters, 'getTileY');

            gpu._renderScanLine();

            spy.should.not.have.been.called();
        });
    });
});
