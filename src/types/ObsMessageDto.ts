import {ObsOpCodeEnum} from './ObsOpCodeEnum';

export type ObsMessageDto = {
    op: ObsOpCodeEnum;
    d: any;
};
