import type {ParseKeys} from 'i18next';

import {StreamTargetDto} from '__types/StreamTargetDto';

export enum OutputStatKeyEnum {
    Timecode = 'timecode',
    Dropped = 'dropped',
    Recent = 'recent',
    Congestion = 'congestion',
}

export type PlatformMarkDto = {
    emoji: string;
    hintKey: ParseKeys;
};

interface OwnProps {
    target: StreamTargetDto;
}

export type Props = OwnProps;
