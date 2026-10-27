type Sample = {
    time: number;
    count: number;
    total: number;
};

// How much a growing counter (and its total) rose over the last `windowSec` seconds.
export class RecentCounter {
    private samples: Sample[] = [];

    constructor(private readonly windowSec: number) {}

    reset() {
        this.samples = [];
    }

    add(time: number, count: number, total: number) {
        const last = this.samples[this.samples.length - 1];

        // counters restarted, e.g. a new stream
        if (last && (count < last.count || total < last.total)) {
            this.samples = [];
        }

        this.samples.push({time, count, total});

        while (this.samples.length > 2 && this.samples[1].time <= time - (this.windowSec * 1000)) {
            this.samples.shift();
        }

        const first = this.samples[0];

        return {count: count - first.count, total: total - first.total};
    }
}
