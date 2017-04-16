const chai = require('chai');
const spies = require('chai-spies');
const CPU = require('../../CPU/CPU.js').default;
const MemoryUnit = require('../../Memory/MemoryUnit.js').default;

chai.use(spies);

const should = chai.should();
const expect = chai.expect;

let cpu = null;

describe('CPU', () => {
    beforeEach (() => {
        cpu = new CPU(new MemoryUnit());
    });

    describe('reset', () => {
        it('should reset CPU clock', () => {
            let spy = chai.spy.on(cpu._clock, 'reset');
            cpu.reset();
            spy.should.have.been.called();
        });

        it('should reset CPU registers', () => {
            let spy = chai.spy.on(cpu._registers, 'reset');
            cpu.reset();
            spy.should.have.been.called();
        });

        it('should reset CPU memory', () => {
            let spy = chai.spy.on(cpu._memory, 'reset');
            cpu.reset();
            spy.should.have.been.called();
        });
    });

    describe('step', () => {
        beforeEach (() => {
            cpu._memory.reset();
            cpu._memory._isInBIOS = false;
        });

        it('should get next operation', () => {
            let spy = chai.spy.on(cpu, '_getNextOperation');
            cpu._step();
            spy.should.have.been.called();
        });

        it('should increment program counter', () => {
            let spy = chai.spy.on(cpu._registers, 'incrementProgramCounter');
            cpu._step();
            spy.should.have.been.called();
        });

        it('should mask program counter', () => {
            let spy = chai.spy.on(cpu._registers, 'maskProgramCounter');
            cpu._step();
            spy.should.have.been.called();
        });

        it('should add instruction clock to CPU clock', () => {
            let spy = chai.spy.on(cpu._clock, 'tick');
            cpu._step();
            spy.should.have.been.called();
        });
    });
});