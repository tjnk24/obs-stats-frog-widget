import {LagViewDto} from './LagViewDto';

export type GeneralViewDto = {
    fps: number;
    frameTime: number;
    cpu: number;
    // megabytes taken by the OBS process
    memory: number;
    encoding: LagViewDto;
    rendering: LagViewDto;
};
