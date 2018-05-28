const chai = require('chai');
const spies = require('chai-spies');
const GPURegisters = require('../../GPU/GPURegisters.js').default;

chai.use(spies);

const should = chai.should();
const expect = chai.expect;

let registers = null;

describe('GPURegisters', () => {
    beforeEach (() => {
        registers = new GPURegisters();
    });

    describe('reset', () => {
        it('should reset scroll X', () => {
            registers._scrollX = 1;
            registers.reset();

            expect(registers._scrollX).to.be.equal(0);
        });

        it('should reset scroll Y', () => {
            registers._scrollY = 1;
            registers.reset();

            expect(registers._scrollY).to.be.equal(0);
        });

        it('should reset window X', () => {
            registers._windowX = 1;
            registers.reset();

            expect(registers._windowX).to.be.equal(0);
        });

        it('should reset window Y', () => {
            registers._windowY = 1;
            registers.reset();

            expect(registers._windowY).to.be.equal(0);
        });

        it('should reset scan line', () => {
            registers._currentScanLine = 1;
            registers.reset();

            expect(registers._currentScanLine).to.be.equal(0);
        });

        it('should reset scan line compare', () => {
            registers._scanLineCompare = 1;
            registers.reset();

            expect(registers._scanLineCompare).to.be.equal(0);
        });

        it('should disable display', () => {
            registers._displayEnabled = true;
            registers.reset();

            expect(registers._displayEnabled).to.be.equal(false);
        });

        it('should disable backgrounds', () => {
            registers._backgroundEnabled = true;
            registers.reset();

            expect(registers._backgroundEnabled).to.be.equal(false);
        });

        it('should disable sprites', () => {
            registers._spritesEnabled = true;
            registers.reset();

            expect(registers._spritesEnabled).to.be.equal(false);
        });

        it('should disable window', () => {
            registers._windowEnabled = true;
            registers.reset();

            expect(registers._windowEnabled).to.be.equal(false);
        });

        it('should set sprite size to 8x8', () => {
            registers._spriteSize = GPURegisters.SPRITE_SIZES.EIGHT_BY_SIXTEEN;
            registers.reset();

            expect(registers._spriteSize).to.be.equal(GPURegisters.SPRITE_SIZES.EIGHT_BY_EIGHT);
        });

        it('should reset tile set index', () => {
            registers._backgroundTilesetIndex = 1;
            registers.reset();

            expect(registers._backgroundTilesetIndex).to.be.equal(0);
        });

        it('should reset tile map index', () => {
            registers._backgroundTilemapIndex = 1;
            registers.reset();

            expect(registers._backgroundTilemapIndex).to.be.equal(0);
        });

        it('should reset window tile map index', () => {
            registers._windowTileMap = 1;
            registers.reset();

            expect(registers._windowTileMap).to.be.equal(0);
        });

        it('should reset background palette', () => {
            registers._backgroundPalette.fill(0);
            registers.reset();

            expect(registers._backgroundPalette.every(val => val === 255)).to.be.equal(true);
        });
    });

    describe('read registers', () => {
       it('should read from control registers', () => {
           let spy = chai.spy.on(registers, 'readControlRegister');
           registers.readRegisters(0xFF40);

           spy.should.have.been.called();
       });

       it('should read scroll Y', () => {
           let spy = chai.spy.on(registers, 'readScrollY');
           registers.readRegisters(0xFF42);

           spy.should.have.been.called();
       });

       it('should read scroll X', () => {
           let spy = chai.spy.on(registers, 'readScrollX');
           registers.readRegisters(0xFF43);

           spy.should.have.been.called();
       });

       it('should read scan line', () => {
           let spy = chai.spy.on(registers, 'readCurrentScanLine');
           registers.readRegisters(0xFF44);

           spy.should.have.been.called();
       });

       it('should read window Y', () => {
           let spy = chai.spy.on(registers, 'readWindowY');
           registers.readRegisters(0xFF4A);

           spy.should.have.been.called();
       });

       it('should read window X', () => {
           let spy = chai.spy.on(registers, 'readWindowX');
           registers.readRegisters(0xFF4B);

           spy.should.have.been.called();
       });
    });

    describe('write registers', () => {
        describe('write control registers', () => {
            it('should set display enabled', () => {
                registers._displayEnabled = false;

                registers.writeRegisters(0xFF40, 0b10000000);

                expect(registers._displayEnabled).to.be.equal(true);

                registers.writeRegisters(0xFF40, 0b01000000);

                expect(registers._displayEnabled).to.be.equal(false);
            });

            it('should set window tile map', () => {
                registers._windowTileMap = 0;

                registers.writeRegisters(0xFF40, 0b01000000);

                expect(registers._windowTileMap).to.be.equal(1);

                registers.writeRegisters(0xFF40, 0b00000000);

                expect(registers._windowTileMap).to.be.equal(0);
            });

            it('should set window enabled', () => {
                registers._windowEnabled = false;

                registers.writeRegisters(0xFF40, 0b00100000);

                expect(registers._windowEnabled).to.be.equal(true);

                registers.writeRegisters(0xFF40, 0b00000000);

                expect(registers._windowEnabled).to.be.equal(false);
            });

            it('should set background tileset index', () => {
                registers._backgroundTilesetIndex = 0;

                registers.writeRegisters(0xFF40, 0b00010000);

                expect(registers._backgroundTilesetIndex).to.be.equal(1);

                registers.writeRegisters(0xFF40, 0b00000000);

                expect(registers._backgroundTilesetIndex).to.be.equal(0);
            });

            it('should set background tilemap index', () => {
                registers._backgroundTilemapIndex = 0;

                registers.writeRegisters(0xFF40, 0b00001000);

                expect(registers._backgroundTilemapIndex).to.be.equal(1);

                registers.writeRegisters(0xFF40, 0b00000000);

                expect(registers._backgroundTilemapIndex).to.be.equal(0);
            });

            it('should set sprite size', () => {
                registers._spriteSize = 0;

                registers.writeRegisters(0xFF40, 0b00000100);

                expect(registers._spriteSize).to.be.equal(1);

                registers.writeRegisters(0xFF40, 0b00000000);

                expect(registers._spriteSize).to.be.equal(0);
            });

            it('should set sprites enabled', () => {
                registers._spritesEnabled = false;

                registers.writeRegisters(0xFF40, 0b00000010);

                expect(registers._spritesEnabled).to.be.equal(true);

                registers.writeRegisters(0xFF40, 0b00000000);

                expect(registers._spritesEnabled).to.be.equal(false);
            });

            it('should set background enabled', () => {
                registers._backgroundEnabled = false;

                registers.writeRegisters(0xFF40, 0b00000001);

                expect(registers._backgroundEnabled).to.be.equal(true);

                registers.writeRegisters(0xFF40, 0b00000000);

                expect(registers._backgroundEnabled).to.be.equal(false);
            });
        });

        it('should write scroll Y', () => {
            registers.writeRegisters(0xFF42, 50);

            expect(registers._scrollY).to.be.equal(50);
        });

        it('should write scroll X', () => {
            registers.writeRegisters(0xFF43, 50);

            expect(registers._scrollX).to.be.equal(50);
        });

        it('should write scan line compare', () => {
            registers.writeRegisters(0xFF45, 50);

            expect(registers._scanLineCompare).to.be.equal(50);
        });

        describe('background palette mapping', () => {
            it('should set values', () => {
                registers.writeRegisters(0xFF47, 0b00011011);

                expect(registers._backgroundPalette[0]).to.be.equal(GPURegisters.PALETTE_VALUES[3]);
                expect(registers._backgroundPalette[1]).to.be.equal(GPURegisters.PALETTE_VALUES[2]);
                expect(registers._backgroundPalette[2]).to.be.equal(GPURegisters.PALETTE_VALUES[1]);
                expect(registers._backgroundPalette[3]).to.be.equal(GPURegisters.PALETTE_VALUES[0]);
            });
        });
    });

    describe('get tile y', () => {
        it('should offset by 0x1800 for tilemap 0', () => {
            registers._currentScanLine = 0;
            registers._scrollY = 0;

            expect(registers.getTileY()).to.be.equal(0x1800);
        });

        it('should offset by 0x1C00 for tilemap 1', () => {
            registers._backgroundTilemapIndex = 1;
            registers._currentScanLine = 0;
            registers._scrollY = 0;

            expect(registers.getTileY()).to.be.equal(0x1C00);
        });

        it('should offset by scroll Y + current scan line', () => {
            registers._backgroundTilemapIndex = 0;
            registers._currentScanLine = 50;
            registers._scrollY = 10;

            expect(registers.getTileY()).to.be.equal(0x1800 + 7);
        });

        it('should wrap if scroll Y + current scan line > 255', () => {
            registers._backgroundTilemapIndex = 0;
            registers._currentScanLine = 200;
            registers._scrollY = 56;

            expect(registers.getTileY()).to.be.equal(0x1800);
        });
    });

    describe('get tile X', () => {
        it('should offset by scroll X', () => {
            registers._scrollX = 0;

            expect(registers.getTileX()).to.be.equal(0);

            registers._scrollX = 60;

            expect(registers.getTileX()).to.be.equal(7);
        });
    });

    describe('get pixel Y', () => {
        it('should calculate pixel position based off of scanline and scroll Y', () => {
            registers._currentScanLine = 4;
            registers._scrollY = 5;

            expect(registers.getPixelY()).to.be.equal(1);

            registers._currentScanLine = 4;
            registers._scrollY = 6;

            expect(registers.getPixelY()).to.be.equal(2);
        });
    });

    describe('get pixel X', () => {
        it('should calculate pixel position based off of scroll X', () => {
            registers._currentScanLine = 4;
            registers._scrollX = 9;

            expect(registers.getPixelX()).to.be.equal(1);

            registers._currentScanLine = 4;
            registers._scrollX = 10;

            expect(registers.getPixelX()).to.be.equal(2);
        });
    });

    describe('offset signed tileIndex', () => {
        it('should return tileIndex + 256 if tileset index is 1 and tileIndex is signed', () => {
            registers._backgroundTilesetIndex = 1;

            expect(registers.offsetSignedTileIndex(127)).to.be.equal(127 + 256);
        });

        it('should return tileIndex if tileset index is 1 and tileIndex is not signed', () => {
            registers._backgroundTilesetIndex = 1;

            expect(registers.offsetSignedTileIndex(128)).to.be.equal(128);
        });

        it('should return tileIndex if tileset index is 0', () => {
            registers._backgroundTilesetIndex = 0;

            expect(registers.offsetSignedTileIndex(128)).to.be.equal(128);
        });
    });

    describe('get background palette color', () => {
        it('should return color for tile pixel data', () => {
            registers._backgroundPalette = [1, 2, 3, 4];
            expect(registers.getBackgroundPaletteColor(0)).to.be.equal(registers._backgroundPalette[0]);

            registers._backgroundPalette = [1, 2, 3, 4];
            expect(registers.getBackgroundPaletteColor(1)).to.be.equal(registers._backgroundPalette[1]);

            registers._backgroundPalette = [1, 2, 3, 4];
            expect(registers.getBackgroundPaletteColor(2)).to.be.equal(registers._backgroundPalette[2]);

            registers._backgroundPalette = [1, 2, 3, 4];
            expect(registers.getBackgroundPaletteColor(3)).to.be.equal(registers._backgroundPalette[3]);
        });
    });
});