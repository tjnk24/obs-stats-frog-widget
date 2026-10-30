import {ObsStreamServiceSettingsDto} from './ObsStreamServiceSettingsDto';

export type ObsStreamServiceDto = {
    streamServiceType: string;
    streamServiceSettings: ObsStreamServiceSettingsDto;
};
