const chai = require('chai');
const spies = require('chai-spies');
const CPUClock = require('../../CPU/CPUClock.js').default;

chai.use(spies);

const should = chai.should();
const expect = chai.expect;

let cpuClock = null;

describe('CPUClock', () => {
    beforeEach (() => {
        cpuClock = new CPUClock();
    });

    describe('reset', () => {
        it('should set all accumulators to 0', () => {
            cpuClock._t = 1;
            cpuClock._m = 4;

            cpuClock.reset();

            expect(cpuClock._t).to.be.equal(0);
            expect(cpuClock._m).to.be.equal(0);
        });
    });

    describe('tick', () => {
        it('should increment registers by default values', () => {
            cpuClock.tick();

            expect(cpuClock._t).to.be.equal(4);
            expect(cpuClock._m).to.be.equal(1);
        });

        it('should increment registers by ticks * default values', () => {
            cpuClock.tick(2);

            expect(cpuClock._t).to.be.equal(8);
            expect(cpuClock._m).to.be.equal(2);

            cpuClock.reset();

            cpuClock.tick(7);

            expect(cpuClock._t).to.be.equal(28);
            expect(cpuClock._m).to.be.equal(7);
        });

        it('should set negative values to 0 steps', () => {
            cpuClock.tick(-4);

            expect(cpuClock._t).to.be.equal(0);
            expect(cpuClock._m).to.be.equal(0);
        })
    });

    describe('getTValue', () => {
        it('should return t counter', () => {
            cpuClock._t = 1;

            expect(cpuClock.getTValue()).to.be.equal(1);
        });
    });

    describe('getBaseValue', () => {
        it('should return m counter', () => {
            cpuClock._m = 4;

            expect(cpuClock.getBaseValue()).to.be.equal(4);
        });
    });

    describe('add time', () => {
        it('should add values of passed in clock to this one', () => {
            const otherCpuClock = new CPUClock();
            otherCpuClock.tick(4);

            cpuClock.addTime(otherCpuClock);

            expect(cpuClock._m).to.be.equal(otherCpuClock._m);
            expect(cpuClock._t).to.be.equal(otherCpuClock._t);
        });
    });
});