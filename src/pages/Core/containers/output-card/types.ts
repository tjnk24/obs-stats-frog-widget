import {OutputViewDto, StreamTargetDto} from '__utils/types';

interface OwnProps {
    target: StreamTargetDto;
    view: OutputViewDto;
    now: number;
}

export type Props = OwnProps;
