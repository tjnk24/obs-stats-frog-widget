import {GraphPointDto} from '__types/GraphPointDto';

interface OwnProps {
    points: GraphPointDto[];
    now: number;
    color: string;
    isActive: boolean;
}

export type Props = OwnProps;

export type DrawGraphParams = Omit<OwnProps, 'isActive'> & {
    canvas: HTMLCanvasElement;
    baselineColor: string;
    width: number;
    height: number;
};
