import {MockOutputStateDto} from '__types/MockOutputStateDto';

import {MOCK_FPS} from './consts';

export const growMockOutput = (output: MockOutputStateDto, elapsedSeconds: number, kbps: number, skippedPerSecond: number) => {
    output.bytes += Math.round(kbps * 125 * elapsedSeconds);
    output.totalFrames += Math.round(MOCK_FPS * elapsedSeconds);
    output.skippedFrames += Math.round(skippedPerSecond * elapsedSeconds);
};
