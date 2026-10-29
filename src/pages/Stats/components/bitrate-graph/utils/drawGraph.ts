import {GRAPH_SPAN_SEC} from '__utils/consts';

import {GRAPH_FILL_ALPHA, GRAPH_HEADROOM} from '../consts';
import {DrawGraphParams} from '../types';

export const drawGraph = ({
    canvas,
    width,
    height,
    points,
    now,
    color,
    baselineColor,
}: DrawGraphParams) => {
    const ratio = window.devicePixelRatio || 1;

    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);

    const context = canvas.getContext('2d');

    if (!context) {
        return;
    }

    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);
    context.fillStyle = baselineColor;
    context.fillRect(0, height - 1, width, 1);

    if (points.length < 2) {
        return;
    }

    const spanMs = GRAPH_SPAN_SEC * 1000;
    const max = (Math.max(...points.map(({kbps}) => kbps)) * GRAPH_HEADROOM) || 1;
    const getX = (time: number) => width - (((now - time) / spanMs) * width);
    const getY = (kbps: number) => height - 1 - ((kbps / max) * (height - 3));

    context.beginPath();

    points.forEach(({time, kbps}, index) => {
        if (index === 0) {
            context.moveTo(getX(time), getY(kbps));
        } else {
            context.lineTo(getX(time), getY(kbps));
        }
    });

    context.strokeStyle = color;
    context.lineWidth = 1.5;
    context.stroke();

    context.lineTo(getX(points[points.length - 1].time), height);
    context.lineTo(getX(points[0].time), height);
    context.closePath();
    context.globalAlpha = GRAPH_FILL_ALPHA;
    context.fillStyle = color;
    context.fill();
    context.globalAlpha = 1;
};
