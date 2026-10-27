import {LagViewDto} from './LagViewDto';

export type GeneralViewDto = {
    fps: number;
    frameTime: number;
    cpu: number;
    encoding: LagViewDto;
    rendering: LagViewDto;
};
