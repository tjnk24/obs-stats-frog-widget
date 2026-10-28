import {NoteDto} from './NoteDto';
import {OutputOriginEnum} from './OutputOriginEnum';
import {PlatformDto} from './PlatformDto';

export type StreamTargetDto = {
    key: string;
    origin: OutputOriginEnum;
    outputName: string | null;
    pluginName: string | null;
    platform: PlatformDto;
    notes: NoteDto[];
};
