const chai = require('chai');
const spies = require('chai-spies');
const CPUOperationMap = require('../../CPU/CPUOperationMap.js').default;
const CPU = require('../../CPU/CPU.js').default;
const CPURegisters = require('../../CPU/CPURegisters.js').default;
const MemoryRegion = require('../../Memory/MemoryRegion.js').default;

chai.use(spies);

const should = chai.should();
const expect = chai.expect;

let cpuOperationMap = null;
let cpu = null;

describe('CPUOperationMap', () => {
    beforeEach (() => {
        cpuOperationMap = new CPUOperationMap();
        cpu = new CPU(new MemoryRegion(0xFFFF, 0xFFFF));
    });

    describe('get operation', () => {
        it('should raise exception if operation is undefined', () => {
            expect(cpuOperationMap.getOperation).to.throw(Error);
        });

        it('should return operation if valid', () => {
            expect(cpuOperationMap.getOperation(0)).to.be.equal(cpuOperationMap._noOp);
        });
    });

    describe('operations', () => {
        describe('(0x00) no operation', () => {
            it('should return 1 tick', () => {
                expect(cpuOperationMap._noOp()).to.be.equal(1);
            });
        });

        describe('(0x05) decrement b register', () => {
            it('should return 1 tick', () => {
                expect(cpuOperationMap._decrementB(cpu)).to.be.equal(1)
            });

            it('should set subtraction flag', () => {
                cpuOperationMap._decrementB(cpu);
                expect(cpu._registers.isSubtractionFlagSet()).to.be.equal(true);
            });

            it('should leave carry flag alone', () => {
                cpu._registers._flags = CPURegisters.FLAGS.CARRY;
                cpuOperationMap._decrementB(cpu);

                expect(cpu._registers.isCarryFlagSet()).to.be.equal(true);

                cpu._registers._flags = CPURegisters.FLAGS.NONE;
                cpuOperationMap._decrementB(cpu);

                expect(cpu._registers.isCarryFlagSet()).to.be.equal(false);
            });

            it('should set zero flag if result is 0', () => {
                cpu._registers._b = 1;
                cpuOperationMap._decrementB(cpu);
                expect(cpu._registers.isZeroFlagSet()).to.be.equal(true);
            });

            it('should not set zero flag if result is not 0', () => {
                cpu._registers._b = 2;
                cpuOperationMap._decrementB(cpu);
                expect(cpu._registers.isZeroFlagSet()).to.be.equal(false);
            });

            it('should set half carry flag if subtraction results in half carry', () => {
                cpu._registers._b = 128;
                cpuOperationMap._decrementB(cpu);
                expect(cpu._registers.isHalfCarryFlagSet()).to.be.equal(true);
            });

            it('should not set half carry flag if subtraction does not result in half carry', () => {
                cpu._registers._b = 129;
                cpuOperationMap._decrementB(cpu);
                expect(cpu._registers.isHalfCarryFlagSet()).to.be.equal(false);
            });
        });

        describe('(0x06) load immediate byte into B register', () => {
            it('should return 2 ticks', () => {
                expect(cpuOperationMap._loadByteIntoB(cpu)).to.be.equal(2);
            });

            it('should load next byte into B', () => {
                cpu._memory.writeByte(0, 75);
                cpuOperationMap._loadByteIntoB(cpu);

                expect(cpu._registers._b).to.be.equal(75);
            });

            it('should increment program counter', () => {
                cpuOperationMap._loadByteIntoA(cpu);
                expect(cpu._registers._programCounter).to.be.equal(1);
            });
        });

        describe('(0x0C) increment C register', () => {
            it('should return 1 tick', () => {
                expect(cpuOperationMap._incrementC(cpu)).to.be.equal(1);
            });

            it('should increment C', () => {
                cpuOperationMap._incrementC(cpu);

                expect(cpu._registers._c).to.be.equal(1);
            });

            it('should not modify carry flag', () => {
                cpu._registers._flags = CPURegisters.FLAGS.CARRY;
                cpuOperationMap._incrementC(cpu);

                expect(cpu._registers.isCarryFlagSet()).to.be.equal(true);
            });

            it('should reset subtraction flag', () => {
                cpu._registers._flags = CPURegisters.FLAGS.SUBTRACTION;
                cpuOperationMap._incrementC(cpu);

                expect(cpu._registers.isSubtractionFlagSet()).to.be.equal(false);
            });

            it('should set zero flag if result is zero', () => {
                cpu._registers._c = 255;
                cpuOperationMap._incrementC(cpu);

                expect(cpu._registers.isZeroFlagSet()).to.be.equal(true);
            });

            it('should not set zero flag if result is not zero', () => {
                cpu._registers._c = 254;
                cpuOperationMap._incrementC(cpu);

                expect(cpu._registers.isZeroFlagSet()).to.be.equal(false);
            });

            it('should set half carry flag if half carry', () => {
                cpu._registers._c = 127;
                cpuOperationMap._incrementC(cpu);

                expect(cpu._registers.isHalfCarryFlagSet()).to.be.equal(true);
            });

            it('should not set half carry flag if no half carry', () => {
                cpu._registers._c = 128;
                cpuOperationMap._incrementC(cpu);

                expect(cpu._registers.isHalfCarryFlagSet()).to.be.equal(false);
            });
        });

        describe('(0x0E) load immediate byte into C register', () => {
            it('should return 2 ticks', () => {
                expect(cpuOperationMap._loadByteIntoC(cpu)).to.be.equal(2);
            });

            it('should load next byte into C', () => {
                cpu._memory.writeByte(0, 75);
                cpuOperationMap._loadByteIntoC(cpu);

                expect(cpu._registers._c).to.be.equal(75);
            });

            it('should increment program counter', () => {
                cpuOperationMap._loadByteIntoC(cpu);
                expect(cpu._registers._programCounter).to.be.equal(1);
            });
        });

        describe('(0x11) load word into DE', () => {
            it('should return 3 ticks', () => {
                expect(cpuOperationMap._loadWordIntoDE(cpu)).to.be.equal(3);
            });

            it('should load first byte into L register', () => {
                cpu._memory.writeByte(0, 124);
                cpuOperationMap._loadWordIntoDE(cpu);
                expect(cpu._registers._e).to.be.equal(124);
            });

            it('should load second byte into H register', () => {
                cpu._memory.writeByte(0, 124);
                cpu._memory.writeByte(1, 1);
                cpuOperationMap._loadWordIntoDE(cpu);
                expect(cpu._registers._d).to.be.equal(1);
            });

            it('should increment program counter by two', () => {
                cpu._memory.writeWord(0, 400);
                cpuOperationMap._loadWordIntoDE(cpu);
                expect(cpu._registers._programCounter).to.be.equal(2);
            });
        });

        describe('(0x17) rotate A left and store 7th bit of old A in carry flag', () => {
            beforeEach(() => {
                cpu._registers._a = 0x81;
            });

            it('should return 2 ticks', () => {
                expect(cpuOperationMap._rotateALeft(cpu)).to.be.equal(2);
            });

            it('should clear the subtraction flag', () => {
                cpu._registers._flags = CPURegisters.FLAGS.SUBTRACTION;
                cpuOperationMap._rotateALeft(cpu);
                expect(cpu._registers.isSubtractionFlagSet()).to.be.equal(false);
            });

            it('should clear the half carry flag', () => {
                cpu._registers._flags = CPURegisters.FLAGS.HALF_CARRY;
                cpuOperationMap._rotateALeft(cpu);
                expect(cpu._registers.isHalfCarryFlagSet()).to.be.equal(false);
            });

            it('should set zero flag if result is 0', () => {
                cpu._registers._a = 0x80;
                cpuOperationMap._rotateALeft(cpu);
                expect(cpu._registers.isZeroFlagSet()).to.be.equal(true);
            });

            it('should not set zero flag if result is not 0', () => {
                cpuOperationMap._rotateALeft(cpu);
                expect(cpu._registers.isZeroFlagSet()).to.be.equal(false);
            });

            it('should set carry flag if 7th bit of original A is set', () => {
                cpu._registers._a = 0b01000001;
                cpuOperationMap._rotateALeft(cpu);
                expect(cpu._registers.isCarryFlagSet()).to.be.equal(true);
            });

            it('should not set carry flag if 7th bit of original A is not set', () => {
                cpu._registers._a = 0b00000001;
                cpuOperationMap._rotateALeft(cpu);
                expect(cpu._registers.isCarryFlagSet()).to.be.equal(true);
            });

            it('should rotate A one bit left with old carry flag as new bit 0', () => {
                cpu._registers._a = 0b00000001;
                cpuOperationMap._rotateALeft(cpu);

                expect(cpu._registers._a).to.be.equal(0b00000010);

                cpu._registers._flags = CPURegisters.FLAGS.CARRY;
                cpu._registers._a = 0b00000001;
                cpuOperationMap._rotateALeft(cpu);

                expect(cpu._registers._a).to.be.equal(0b00000011);
            });
        });

        describe('(0x1A) load DE pointer into A', () => {
            it('should return 2 ticks', () => {
                expect(cpuOperationMap._loadDEPointerIntoA(cpu)).to.be.equal(2);
            });

            it('should write value at DE pointer to A', () => {
                cpu._registers.setDERegister(400);
                cpu._memory.writeByte(400, 75);

                cpuOperationMap._loadDEPointerIntoA(cpu);

                expect(cpu._registers._a).to.be.equal(75);
            });
        });

        describe('(0x20) jump to relative position if zero flag is NOT set', () => {
            it('should return 2 ticks if zero flag is set', () => {
                cpu._registers._flags |= CPURegisters.FLAGS.ZERO;
                expect(cpuOperationMap._relativeJumpIfZeroFlag(cpu)).to.be.equal(2);
            });

            it('should return 3 ticks if zero flag is not set', () => {
                expect(cpuOperationMap._relativeJumpIfZeroFlag(cpu)).to.be.equal(3);
            });

            it('should increment program counter by one if zero flag is on', () => {
                cpu._registers._flags |= CPURegisters.FLAGS.ZERO;
                cpuOperationMap._relativeJumpIfZeroFlag(cpu);

                expect(cpu._registers._programCounter).to.be.equal(1);
            });

            it('should jump to positive relative position if zero flag is not set', () => {
                cpu._memory.writeByte(0, 6);
                cpuOperationMap._relativeJumpIfZeroFlag(cpu);

                expect(cpu._registers._programCounter).to.be.equal(7);
            });

            it('should jump to negative relative position if zero flag is not set and byte > 127', () => {
                cpu._registers._programCounter = 400;
                cpu._memory.writeByte(400, 137); // -119 when flipped
                cpuOperationMap._relativeJumpIfZeroFlag(cpu);

                expect(cpu._registers._programCounter).to.be.equal(282);
            });

            it('should not jump to positive relative position if zero flag is set', () => {
                cpu._registers._flags |= CPURegisters.FLAGS.ZERO;
                cpu._memory.writeByte(0, 6);
                cpuOperationMap._relativeJumpIfZeroFlag(cpu);

                expect(cpu._registers._programCounter).to.be.equal(1);
            });
        });

        describe('(0x21) load word into HL', () => {
            it('should return 3 ticks', () => {
                expect(cpuOperationMap._loadWordIntoHL(cpu)).to.be.equal(3);
            });

            it('should load first byte into L register', () => {
                cpu._memory.writeByte(0, 124);
                cpuOperationMap._loadWordIntoHL(cpu);
                expect(cpu._registers._l).to.be.equal(124);
            });

            it('should load second byte into H register', () => {
                cpu._memory.writeByte(0, 124);
                cpu._memory.writeByte(1, 1);
                cpuOperationMap._loadWordIntoHL(cpu);
                expect(cpu._registers._h).to.be.equal(1);
            });

            it('should increment program counter by two', () => {
                cpu._memory.writeWord(0, 400);
                cpuOperationMap._loadWordIntoHL(cpu);
                expect(cpu._registers._programCounter).to.be.equal(2);
            });
        });

        describe('(0x22) load A into HL address, increment HL', () => {
            it('should return 2 ticks', () => {
                expect(cpuOperationMap._loadAToHLAddressIncrement(cpu)).to.be.equal(2);
            });

            it('should load A into HL address', () => {
                cpu._registers.setHLRegister(400);
                cpu._registers._a = 20;

                cpuOperationMap._loadAToHLAddressIncrement(cpu);

                expect(cpu._memory.readByte(400)).to.be.equal(20);
            });

            it('should increment HL by one', () => {
                cpu._registers.setHLRegister(400);

                cpuOperationMap._loadAToHLAddressIncrement(cpu);

                expect(cpu._registers.getHLRegister()).to.be.equal(401);
            });
        });

        describe('(0x23) increment HL', () => {
            it('should return 1 tick', () => {
                expect(cpuOperationMap._incrementHL(cpu)).to.be.equal(1);
            });

            it('should increment HL by one', () => {
                cpuOperationMap._incrementHL(cpu);
                expect(cpu._registers.getHLRegister()).to.be.equal(1);
            });
        });

        describe('(0x31) load word into stack pointer', () => {
            it('should return 3 ticks', () => {
                expect(cpuOperationMap._loadWordIntoStackPointer(cpu)).to.be.equal(3);
            });

            it('should load next word in memory into stack pointer', () => {
                cpu._memory.writeWord(0, 400);
                cpuOperationMap._loadWordIntoStackPointer(cpu);
                expect(cpu._registers._stackPointer).to.be.equal(400);
            });

            it('should increment program counter by two', () => {
                cpu._memory.writeWord(0, 400);
                cpuOperationMap._loadWordIntoStackPointer(cpu);
                expect(cpu._registers._programCounter).to.be.equal(2);
            });
        });

        describe('(0x32) load A into HL address, decrement HL', () => {
            it('should return 2 ticks', () => {
                expect(cpuOperationMap._loadAToHLAddressDecrement(cpu)).to.be.equal(2);
            });

            it('should load A into HL address', () => {
                cpu._registers.setHLRegister(400);
                cpu._registers._a = 20;

                cpuOperationMap._loadAToHLAddressDecrement(cpu);

                expect(cpu._memory.readByte(400)).to.be.equal(20);
            });

            it('should decrement HL by one', () => {
                cpu._registers.setHLRegister(400);

                cpuOperationMap._loadAToHLAddressDecrement(cpu);

                expect(cpu._registers.getHLRegister()).to.be.equal(399);
            });
        });

        describe('(0x33) increment stack pointer', () => {
            it('should return 1 tick', () => {
                expect(cpuOperationMap._incrementStackPointer(cpu)).to.be.equal(1);
            });

            it('should increment stack pointer by one', () => {
                cpuOperationMap._incrementStackPointer(cpu);
                expect(cpu._registers._stackPointer).to.be.equal(1);
            });
        });

        describe('(0x3E) load immediate byte into A register', () => {
            it('should return 2 ticks', () => {
                expect(cpuOperationMap._loadByteIntoA(cpu)).to.be.equal(2);
            });

            it('should load next byte into A', () => {
                cpu._memory.writeByte(0, 75);
                cpuOperationMap._loadByteIntoA(cpu);

                expect(cpu._registers._a).to.be.equal(75);
            });

            it('should increment program counter', () => {
                cpuOperationMap._loadByteIntoA(cpu);
                expect(cpu._registers._programCounter).to.be.equal(1);
            });
        });

        describe('(0x4F) copy A to C', () => {
            it('should return 1 tick', () => {
                expect(cpuOperationMap._copyAToC(cpu)).to.be.equal(1);
            });

            it('should copy A to C', () => {
                cpu._registers._a = 45;
                cpu._registers._c = 99;

                cpuOperationMap._copyAToC(cpu);

                expect(cpu._registers._c).to.be.equal(cpu._registers._a);
            });
        });

        describe('(0x77) load A register into HL address', () => {
            it('should return 2 ticks', () => {
                expect(cpuOperationMap._loadAToHLAddress(cpu)).to.be.equal(2);
            });

            it('should load A into HL address', () => {
                cpu._registers.setHLRegister(400);
                cpu._registers._a = 20;

                cpuOperationMap._loadAToHLAddress(cpu);

                expect(cpu._memory.readByte(400)).to.be.equal(20);
            });
        });

        describe('(0x80) add B register to A register', () => {
            it('should return 1 tick', () => {
                expect(cpuOperationMap._addBToA(cpu)).to.be.equal(1);
            });

            it('should add B to A', () => {
                cpu._registers._b = 5;
                cpu._registers._a = 2;

                cpuOperationMap._addBToA(cpu);

                expect(cpu._registers._a).to.be.equal(7);
            });

            it('should set carry flag if result > 255', () => {
                cpu._registers._b = 200;
                cpu._registers._a = 56;

                cpuOperationMap._addBToA(cpu);

                expect(cpu._registers.isCarryFlagSet()).to.be.equal(true);
            });

            it('should not set carry flag if result <= 255', () => {
                cpu._registers._b = 200;
                cpu._registers._a = 55;

                cpuOperationMap._addBToA(cpu);

                expect(cpu._registers.isCarryFlagSet()).to.be.equal(false);
            });

            it('should mask A to a byte', () => {
                cpu._registers._b = 200;
                cpu._registers._a = 56;

                cpuOperationMap._addBToA(cpu);

                expect(cpu._registers._a).to.be.equal(256 & 255);
            });

            it('should set zero flag if result === 0', () => {
                cpu._registers._b = 200;
                cpu._registers._a = 56;

                cpuOperationMap._addBToA(cpu);

                expect(cpu._registers.isZeroFlagSet()).to.be.equal(true);
            });

            it('should not set zero flag if result > 0', () => {
                cpu._registers._b = 200;
                cpu._registers._a = 55;

                cpuOperationMap._addBToA(cpu);

                expect(cpu._registers.isZeroFlagSet()).to.be.equal(false);
            });

            it('should set half carry flag if result has half carry', () => {
                cpu._registers._a = 63;
                cpu._registers._b = 100;
                cpuOperationMap._addBToA(cpu);

                expect(cpu._registers.isHalfCarryFlagSet()).to.be.equal(true);
            });
        });

        describe('(0xAF) xor A register', () => {
            it('should xor the A register', () => {
                cpu._registers._a = 100;
                cpuOperationMap._xorA(cpu);

                expect(cpu._registers._a).to.be.equal(100 ^ 100);
            });

            it('should return 1 tick', () => {
                expect(cpuOperationMap._xorA(cpu)).to.be.equal(1);
            });

            it('should set zero flag', () => {
                cpu._registers._flags = CPURegisters.FLAGS.NONE;
                cpuOperationMap._xorA(cpu);
                expect(cpu._registers._flags).to.be.equal(CPURegisters.FLAGS.ZERO);
            });
        });

        describe('(0xC1) pop from stack into BC', () => {
            it('should return 3 ticks', () => {
                expect(cpuOperationMap._popStackToBC(cpu)).to.be.equal(3);
            });

            it('should increment stack pointer by 2', () => {
                cpu._registers._stackPointer = 100;
                cpuOperationMap._popStackToBC(cpu);

                expect(cpu._registers._stackPointer).to.be.equal(102);
            });

            it('should write word at top of stack to BC', () => {
                cpu._registers._stackPointer = 100;
                cpu._memory.writeWord(cpu._registers._stackPointer, 400);
                cpuOperationMap._popStackToBC(cpu);

                expect(cpu._registers.getBCRegister()).to.be.equal(400);
            });
        });

        describe('(0xC5) push BC to stack', () => {
            it('should return 4 ticks', () => {
                expect(cpuOperationMap._pushBCToStack(cpu)).to.be.equal(4);
            });

            it('should decrement stack pointer by 2', () => {
                cpu._registers._stackPointer = 100;
                cpuOperationMap._pushBCToStack(cpu);

                expect(cpu._registers._stackPointer).to.be.equal(98);
            });

            it('should write BC to stack', () => {
                cpu._registers._stackPointer = 100;
                cpu._registers.setBCRegister(400);
                cpuOperationMap._pushBCToStack(cpu);

                expect(cpu._memory.readWord(cpu._registers._stackPointer)).to.be.equal(cpu._registers.getBCRegister());
            });
        });

        describe('(0xCB) execute next byte as extension operation', () => {
            it('should execute next byte as an extension method', () => {
                cpu._memory.writeByte(0, 5);

                let mockExtension = function () {};
                let spy = chai.spy(mockExtension);

                cpuOperationMap._extendedOperationMap[5] = spy;

                cpuOperationMap._extensionOperation(cpu);

                spy.should.have.been.called.with(cpu);
            });

            it('should return ticks from extension method call', () => {
                cpu._memory.writeByte(0, 5);

                cpuOperationMap._extendedOperationMap[5] = function () {
                    return 4;
                };

                expect(cpuOperationMap._extensionOperation(cpu)).to.be.equal(4);

            });
        });

        describe('(0xCD) call routine at 16 bit address', () => {
            it('should return 5 ticks', () => {
                expect(cpuOperationMap._callRoutineAtWord(cpu)).to.be.equal(5);
            });

            it('should decrement stack pointer by two so we can store return address', () => {
                cpu._registers._stackPointer = 100;
                cpuOperationMap._callRoutineAtWord(cpu);

                expect(cpu._registers._stackPointer).to.be.equal(98);
            });

            it('should write program counter + 2 to stack', () => {
                cpu._registers._programCounter = 75;
                cpu._registers._stackPointer = 100;
                cpuOperationMap._callRoutineAtWord(cpu);

                expect(cpu._memory.readWord(cpu._registers._stackPointer)).to.be.equal(77);
            });

            it('should set program counter to stored word', () => {
                cpu._memory.writeWord(0, 125);
                cpuOperationMap._callRoutineAtWord(cpu);

                expect(cpu._registers._programCounter).to.be.equal(125);
            });
        });

        describe('(0xC9) return from routine', () => {
            it('should return 4 ticks', () => {
                expect(cpuOperationMap._return(cpu)).to.be.equal(4);
            });

            it('should set program counter to address at top of stack', () => {
                cpu._registers._stackPointer = 100;
                cpu._memory.writeWord(cpu._registers._stackPointer, 400);

                cpuOperationMap._return(cpu);

                expect(cpu._registers._programCounter).to.be.equal(400);
            });

            it('should increment stack pointer by 2', () => {
                cpuOperationMap._return(cpu);

                expect(cpu._registers._stackPointer).to.be.equal(2);
            });
        });

        describe('(0xE0) load A into offset immediate', () => {
            it('should return 3 ticks', () => {
                expect(cpuOperationMap._loadAIntoOffsetImmediate(cpu)).to.be.equal(3);
            });

            it('should write A to immediate + 65280', () => {
                cpu._registers._a = 45;
                cpu._memory.writeByte(0, 20);

                cpuOperationMap._loadAIntoOffsetImmediate(cpu);

                expect(cpu._memory.readByte(65280 + 20)).to.be.equal(45);
            });

            it('should increment program counter', () => {
                cpuOperationMap._loadAIntoOffsetImmediate(cpu);
                expect(cpu._registers._programCounter).to.be.equal(1);
            });
        });

        describe('(0xE2) load A into offset C', () => {
            it('should return 2 ticks', () => {
                expect(cpuOperationMap._loadAIntoOffsetC(cpu)).to.be.equal(2);
            });

            it('should write A to C + 65280', () => {
                cpu._registers._a = 45;
                cpu._registers._c = 20;

                cpuOperationMap._loadAIntoOffsetC(cpu);

                expect(cpu._memory.readByte(65280 + cpu._registers._c)).to.be.equal(45);
            })
        });

        describe('(0xFE) compare byte to A register', () => {
            beforeEach(() => {
                cpu._registers._a = 75;
            });

            it('should not change A register', () => {
                cpu._memory.writeByte(0, 25);
                cpuOperationMap._compareByteToA(cpu);

                expect(cpu._registers._a).to.be.equal(75);
            });

            it('should increment program counter', () => {
                cpuOperationMap._compareByteToA(cpu);
                expect(cpu._registers._programCounter).to.be.equal(1);
            });

            it('should set carry flag if underflow', () => {
                cpu._memory.writeByte(0, 100);
                cpuOperationMap._compareByteToA(cpu);
                expect(cpu._registers.isCarryFlagSet()).to.be.equal(true);
            });

            it('should not set carry flag if no underflow', () => {
                cpu._memory.writeByte(0, 74);
                cpuOperationMap._compareByteToA(cpu);
                expect(cpu._registers.isCarryFlagSet()).to.be.equal(false);
            });

            it('should set subtraction flag', () => {
                cpu._memory.writeByte(0, 100);
                cpuOperationMap._compareByteToA(cpu);
                expect(cpu._registers.isSubtractionFlagSet()).to.be.equal(true);
            });

            it('should set zero flag is result was zero', () => {
                cpu._memory.writeByte(0, 75);
                cpuOperationMap._compareByteToA(cpu);
                expect(cpu._registers.isZeroFlagSet()).to.be.equal(true);
            });

            it('should not set zero flag is result was not zero', () => {
                cpu._memory.writeByte(0, 74);
                cpuOperationMap._compareByteToA(cpu);
                expect(cpu._registers.isZeroFlagSet()).to.be.equal(false);

                cpu._memory.writeByte(1, 76);
                cpuOperationMap._compareByteToA(cpu);
                expect(cpu._registers.isZeroFlagSet()).to.be.equal(false);
            });

            it('should set half carry flag if there is a half carry', () => {
                cpu._registers._a = 100;
                cpu._memory.writeByte(0, 25);
                cpuOperationMap._compareByteToA(cpu);

                expect(cpu._registers.isHalfCarryFlagSet()).to.be.equal(true);
            });

            it('should not set half carry flag if there is no half carry', () => {
                cpu._memory.writeByte(0, 5);
                cpuOperationMap._compareByteToA(cpu);

                expect(cpu._registers.isHalfCarryFlagSet()).to.be.equal(false);
            });

            it('should return 2 ticks', () => {
                expect(cpuOperationMap._compareByteToA(cpu)).to.be.equal(2);
            });
        });

        describe('(0xCB11) rotate c left and store 7th bit of old c in carry flag', () => {
            beforeEach(() => {
                cpu._registers._c = 0x81;
            });

            it('should return 2 ticks', () => {
                expect(cpuOperationMap._rotateCLeft(cpu)).to.be.equal(2);
            });

            it('should clear the subtraction flag', () => {
                cpu._registers._flags = CPURegisters.FLAGS.SUBTRACTION;
                cpuOperationMap._rotateCLeft(cpu);
                expect(cpu._registers.isSubtractionFlagSet()).to.be.equal(false);
            });

            it('should clear the half carry flag', () => {
                cpu._registers._flags = CPURegisters.FLAGS.HALF_CARRY;
                cpuOperationMap._rotateCLeft(cpu);
                expect(cpu._registers.isHalfCarryFlagSet()).to.be.equal(false);
            });

            it('should set zero flag if result is 0', () => {
                cpu._registers._c = 0x80;
                cpuOperationMap._rotateCLeft(cpu);
                expect(cpu._registers.isZeroFlagSet()).to.be.equal(true);
            });

            it('should not set zero flag if result is not 0', () => {
                cpuOperationMap._rotateCLeft(cpu);
                expect(cpu._registers.isZeroFlagSet()).to.be.equal(false);
            });

            it('should set carry flag if 7th bit of original C is set', () => {
                cpu._registers._c = 0b01000001;
                cpuOperationMap._rotateCLeft(cpu);
                expect(cpu._registers.isCarryFlagSet()).to.be.equal(true);
            });

            it('should not set carry flag if 7th bit of original C is not set', () => {
                cpu._registers._c = 0b00000001;
                cpuOperationMap._rotateCLeft(cpu);
                expect(cpu._registers.isCarryFlagSet()).to.be.equal(true);
            });

            it('should rotate c one bit left with old carry flag as new bit 0', () => {
                cpu._registers._c = 0b00000001;
                cpuOperationMap._rotateCLeft(cpu);

                expect(cpu._registers._c).to.be.equal(0b00000010);

                cpu._registers._flags = CPURegisters.FLAGS.CARRY;
                cpu._registers._c = 0b00000001;
                cpuOperationMap._rotateCLeft(cpu);

                expect(cpu._registers._c).to.be.equal(0b00000011);
            });
        });

        describe('(0xCB7C) test bit 7 of register h', () => {
            beforeEach(() => {
                cpu._registers._h = 0x81;
            });

            it('should return 2 ticks', () => {
                expect(cpuOperationMap._testBit7FromH(cpu)).to.be.equal(2);
            });

            it('should clear the subtraction flag', () => {
                cpu._registers._flags = CPURegisters.FLAGS.SUBTRACTION;
                cpuOperationMap._testBit7FromH(cpu);
                expect(cpu._registers.isSubtractionFlagSet()).to.be.equal(false);
            });

            it('should not touch the carry flag', () => {
                cpu._registers._flags = CPURegisters.FLAGS.CARRY;
                cpuOperationMap._testBit7FromH(cpu);
                expect(cpu._registers.isCarryFlagSet()).to.be.equal(true);

                cpu._registers._flags = CPURegisters.FLAGS.NONE;
                cpuOperationMap._testBit7FromH(cpu);
                expect(cpu._registers.isCarryFlagSet()).to.be.equal(false);
            });

            it('should set the half-carry flag', () => {
                cpuOperationMap._testBit7FromH(cpu);
                expect(cpu._registers.isHalfCarryFlagSet()).to.be.equal(true);
            });

            it('should set the zero flag if 7th bit of h is 0', () => {
                cpu._registers._h = 0x79;
                cpuOperationMap._testBit7FromH(cpu);
                expect(cpu._registers.isZeroFlagSet()).to.be.equal(true);
            });

            it('should clear the zero flag if 7th bit of h is 1', () => {
                cpu._registers._h = 0x81;
                cpuOperationMap._testBit7FromH(cpu);
                expect(cpu._registers.isZeroFlagSet()).to.be.equal(false);
            });
        })
    });
});
