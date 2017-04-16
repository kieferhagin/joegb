class CPUClock {
    _t = 0; // 1 CPU step (4,194,304Hz)
    _m = 0; // 4x CPU step  (1,048,576Hz)

    tick (steps=1) {
        if (steps <= 0) {
            return;
        }

        this._t += steps * 4;
        this._m += steps;
    }

    getTValue () {
        return this._t;
    }

    getBaseValue () {
        return this._m;
    }

    reset () {
        this._m = 0;
        this._t = 0;
    }

    addTime (cpuClock) {
        this._t += cpuClock.getTValue();
        this._m += cpuClock.getBaseValue();
    }
}

export default CPUClock;
