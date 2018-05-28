const chai = require('chai');
const spies = require('chai-spies');
const GPUScreen = require('../../GPU/GPUScreen.js').default;

chai.use(spies);

const should = chai.should();
const expect = chai.expect;

let screen = null;

describe('GPUScreen', () => {
    beforeEach (() => {
        screen = new GPUScreen();
    });

    describe('construct', () => {
        it('should set width', () => {
            expect(screen._width).to.be.equal(160);
        });

        it('should set height', () => {
            expect(screen._height).to.be.equal(144);
        });

        it('should call reset', () => {
            let spy = chai.spy.on(GPUScreen.prototype, 'reset');
            screen = new GPUScreen();

            spy.should.have.been.called();
        });
    });

    describe('reset', () => {
        it('should set screen to white', () => {
            screen._data.fill(0);
            screen.reset();

            expect(screen._data.every(element => element === 255)).to.be.equal(true);
        });

        it('should set array length to width * height * 4', () => {
            screen.reset();

            expect(screen._data.length).to.be.equal(screen._width * screen._height * 4);
        });
    });

    describe('set pixel', () => {
        it('should set red component', () => {
            screen.setPixel(10, 10, {
                r: 145,
                g: 144,
                b: 143,
                a: 255
            });

            expect(screen._data[10 * screen._width + 10]).to.be.equal(145);
        });

        it('should set green component', () => {
            screen.setPixel(10, 10, {
                r: 145,
                g: 144,
                b: 143,
                a: 255
            });

            expect(screen._data[10 * screen._width + 11]).to.be.equal(144);
        });

        it('should set blue component', () => {
            screen.setPixel(10, 10, {
                r: 145,
                g: 144,
                b: 143,
                a: 255
            });

            expect(screen._data[10 * screen._width + 12]).to.be.equal(143);
        });

        it('should set alpha component', () => {
            screen.setPixel(10, 10, {
                r: 145,
                g: 144,
                b: 143,
                a: 254
            });

            expect(screen._data[10 * screen._width + 13]).to.be.equal(254);
        });
    });
});