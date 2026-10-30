export type ObsStatsDto = {
    activeFps: number;
    averageFrameRenderTime: number;
    cpuUsage: number;
    memoryUsage: number;
    availableDiskSpace: number;
    renderSkippedFrames: number;
    renderTotalFrames: number;
    outputSkippedFrames: number;
    outputTotalFrames: number;
};
