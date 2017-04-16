import React, { Component } from 'react';
import MemoryROM from './emulator/Memory/MemoryROM.js';
import fs from 'fs';
import GameBoy from "./emulator/GameBoy";

class App extends Component {
    render () {
        return (<div>Test 123</div>);
    }

    componentDidMount () {
        const rom = new MemoryROM(fs.readFileSync('/Users/kieferhagin/Projects/joe-gb/src/pokemon_red.gb'));
        console.log(rom.getHeaderInfo());

        const gameboy = new GameBoy();
        gameboy.loadROM(rom);

        gameboy.start();
    }
}

export default App;
