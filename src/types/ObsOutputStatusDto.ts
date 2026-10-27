export type ObsOutputStatusDto = {
    outputActive: boolean;
    outputReconnecting: boolean;
    outputTimecode: string;
    outputDuration: number;
    outputCongestion: number;
    outputBytes: number;
    outputSkippedFrames: number;
    outputTotalFrames: number;
};
