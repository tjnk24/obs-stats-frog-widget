import {GraphPointDto} from '__types/GraphPointDto';

interface OwnProps {
    points: GraphPointDto[];
    now: number;
    color: string;
}

export type Props = OwnProps;

export type DrawGraphParams = OwnProps & {
    canvas: HTMLCanvasElement;
    baselineColor: string;
    width: number;
    height: number;
};
