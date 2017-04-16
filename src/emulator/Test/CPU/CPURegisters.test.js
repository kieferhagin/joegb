const chai = require('chai');
const spies = require('chai-spies');
const CPURegisters = require('../../CPU/CPURegisters.js').default;

chai.use(spies);

const should = chai.should();
const expect = chai.expect;

let cpuRegisters = null;

describe('CPURegisters', () => {
    beforeEach (() => {
        cpuRegisters = new CPURegisters();
    });

    describe('reset', () => {
        it('should set all registers to 0', () => {
            cpuRegisters._a = 1;
            cpuRegisters._b = 1;
            cpuRegisters._c = 1;
            cpuRegisters._d = 1;
            cpuRegisters._e = 1;
            cpuRegisters._h = 1;
            cpuRegisters._l = 1;
            cpuRegisters._flags = 1;

            cpuRegisters._programCounter = 1;
            cpuRegisters._stackPointer = 1;

            cpuRegisters.reset();

            expect(cpuRegisters._a).to.be.equal(0);
            expect(cpuRegisters._b).to.be.equal(0);
            expect(cpuRegisters._c).to.be.equal(0);
            expect(cpuRegisters._d).to.be.equal(0);
            expect(cpuRegisters._e).to.be.equal(0);
            expect(cpuRegisters._h).to.be.equal(0);
            expect(cpuRegisters._l).to.be.equal(0);
            expect(cpuRegisters._flags).to.be.equal(0);

            expect(cpuRegisters._programCounter).to.be.equal(0);
            expect(cpuRegisters._stackPointer).to.be.equal(0);
        });
    });

    describe('increment program counter', () => {
        it('should add one to program counter', () => {
            cpuRegisters.incrementProgramCounter();
            expect(cpuRegisters._programCounter).to.be.equal(1);
        });

        it('should return value', () => {
            const pc = cpuRegisters.incrementProgramCounter();
            expect(pc).to.be.equal(0);
        });
    });

    describe('mask program counter', () => {
        it('should mask program counter to 16 bits', () => {
            const expected = 19584944444 & 65535;
            cpuRegisters._programCounter = 19584944444;

            cpuRegisters.maskProgramCounter();

            expect(cpuRegisters._programCounter).to.be.equal(expected);
        });
    });

    describe('flag checks', () => {
        describe('zero flag', () => {
            it('should return true if zero flag set', () => {
                cpuRegisters._flags |= CPURegisters.FLAGS.SUBTRACTION;
                cpuRegisters._flags |= CPURegisters.FLAGS.ZERO;

                expect(cpuRegisters.isZeroFlagSet()).to.be.equal(true);
            });

            it('should return false if zero flag unset', () => {
                cpuRegisters._flags = CPURegisters.FLAGS.NONE;

                expect(cpuRegisters.isZeroFlagSet()).to.be.equal(false);
            });
        });

        describe('subtraction flag', () => {
            it('should return true if flag set', () => {
                cpuRegisters._flags |= CPURegisters.FLAGS.SUBTRACTION;
                cpuRegisters._flags |= CPURegisters.FLAGS.ZERO;

                expect(cpuRegisters.isSubtractionFlagSet()).to.be.equal(true);
            });

            it('should return false if flag unset', () => {
                cpuRegisters._flags = CPURegisters.FLAGS.HALF_CARRY;

                expect(cpuRegisters.isSubtractionFlagSet()).to.be.equal(false);
            });
        });

        describe('half carry flag', () => {
            it('should return true if flag set', () => {
                cpuRegisters._flags |= CPURegisters.FLAGS.SUBTRACTION;
                cpuRegisters._flags |= CPURegisters.FLAGS.HALF_CARRY;

                expect(cpuRegisters.isHalfCarryFlagSet()).to.be.equal(true);
            });

            it('should return false if flag unset', () => {
                cpuRegisters._flags = CPURegisters.FLAGS.CARRY;

                expect(cpuRegisters.isHalfCarryFlagSet()).to.be.equal(false);
            });
        });

        describe('carry flag', () => {
            it('should return true if flag set', () => {
                cpuRegisters._flags |= CPURegisters.FLAGS.SUBTRACTION;
                cpuRegisters._flags |= CPURegisters.FLAGS.CARRY;

                expect(cpuRegisters.isCarryFlagSet()).to.be.equal(true);
            });

            it('should return false if flag unset', () => {
                cpuRegisters._flags = CPURegisters.FLAGS.HALF_CARRY;

                expect(cpuRegisters.isCarryFlagSet()).to.be.equal(false);
            });
        });
    });

    describe('get HL 16 bit register', () => {
        it('should return word stored in HL', () => {
            cpuRegisters._l = 144;
            cpuRegisters._h = 1;

            expect(cpuRegisters.getHLRegister()).to.be.equal(400);
        });
    });

    describe('set HL 16 bit register', () => {
        it('should return word stored in HL', () => {
            cpuRegisters.setHLRegister(400);

            expect(cpuRegisters._l).to.be.equal(144);
            expect(cpuRegisters._h).to.be.equal(1);
        });
    });

    describe('get DE 16 bit register', () => {
        it('should return word stored in DE', () => {
            cpuRegisters._e = 144;
            cpuRegisters._d = 1;

            expect(cpuRegisters.getDERegister()).to.be.equal(400);
        });
    });

    describe('set DE 16 bit register', () => {
        it('should return word stored in DE', () => {
            cpuRegisters.setDERegister(400);

            expect(cpuRegisters._e).to.be.equal(144);
            expect(cpuRegisters._d).to.be.equal(1);
        });
    });

    describe('get BC 16 bit register', () => {
        it('should return word stored in BC', () => {
            cpuRegisters._c = 144;
            cpuRegisters._b = 1;

            expect(cpuRegisters.getBCRegister()).to.be.equal(400);
        });
    });

    describe('set BC 16 bit register', () => {
        it('should return word stored in BC', () => {
            cpuRegisters.setBCRegister(400);

            expect(cpuRegisters._c).to.be.equal(144);
            expect(cpuRegisters._b).to.be.equal(1);
        });
    });
});
