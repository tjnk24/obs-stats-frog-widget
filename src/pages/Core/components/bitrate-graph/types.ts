import {GraphPointDto} from '__utils/types';

interface OwnProps {
    points: GraphPointDto[];
    now: number;
    color: string;
}

export type Props = OwnProps;

export type DrawGraphParams = OwnProps & {
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
};
