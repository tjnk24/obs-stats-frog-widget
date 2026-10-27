import {theme, Tooltip} from 'antd';
import {
    useEffect,
    useRef,
    useState,
} from 'react';

import {GRAPH_SPAN_SEC} from '__utils/consts';

import {GRAPH_HEIGHT} from './consts';
import {Props} from './types';
import {drawGraph} from './utils/drawGraph';

import style from './style.module.scss';

const BitrateGraph = ({points, now, color}: Props) => {
    const {token} = theme.useToken();

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [width, setWidth] = useState(0);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(([{contentRect}]) => setWidth(contentRect.width));

        resizeObserver.observe(canvasRef.current);

        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        if (canvasRef.current && width > 0) {
            drawGraph({
                canvas: canvasRef.current,
                width,
                height: GRAPH_HEIGHT,
                points,
                now,
                color,
                baselineColor: token.colorBorder,
            });
        }
    }, [color, now, points, token.colorBorder, width]);

    return (
        <Tooltip title={`Битрейт за последние ${GRAPH_SPAN_SEC / 60} мин`}>
            <canvas
                ref={canvasRef}
                className={style.graph}
                style={{height: GRAPH_HEIGHT}}
            />
        </Tooltip>
    );
};

export default BitrateGraph;
