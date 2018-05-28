import React, { Component } from 'react';
import MemoryROM from './emulator/Memory/MemoryROM.js';
import fs from 'fs';
import GameBoy from "./emulator/GameBoy";

class App extends Component {
    render () {
        return (
            <div style={{'backgroundColor': 'black'}}>
                <canvas id="canvasElement" width="160" height="144">

                </canvas>
            </div>
        );
    }

    componentDidMount () {
        const rom = new MemoryROM(fs.readFileSync('/Users/kieferhagin/Projects/joe-gb/src/Tetris.gb'));
        // const rom = new MemoryROM(fs.readFileSync('/Users/kieferhagin/Projects/joe-gb/src/opus5.gb'));
        console.log(rom.getHeaderInfo());

        const gameboy = new GameBoy();
        gameboy.loadROM(rom);
        const canvasElement = document.getElementById('canvasElement');
        debugger;
        gameboy.start(canvasElement);
    }
}

export default App;
