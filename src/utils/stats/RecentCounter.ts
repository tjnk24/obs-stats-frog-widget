import {RecentSampleDto} from '__types/RecentSampleDto';

export class RecentCounter {
    private samples: RecentSampleDto[] = [];

    constructor(private readonly windowSec: number) {}

    reset() {
        this.samples = [];
    }

    add(time: number, count: number, total: number) {
        const last = this.samples[this.samples.length - 1];

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
