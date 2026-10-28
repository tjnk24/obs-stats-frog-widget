import {LineChartOutlined} from '@ant-design/icons';
import {
    Flex,
    theme,
    Tooltip,
    Typography,
} from 'antd';
import {
    useEffect,
    useRef,
    useState,
} from 'react';

import {GRAPH_SPAN_SEC} from '__utils/consts';

import {GRAPH_MIN_HEIGHT} from './consts';
import {Props} from './types';
import {drawGraph} from './utils/drawGraph';

import style from './style.module.scss';

const BitrateGraph = ({
    points,
    now,
    color,
    isActive,
}: Props) => {
    const {token} = theme.useToken();

    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [size, setSize] = useState({width: 0, height: 0});

    // a line needs two points: the first one comes a poll after the stream starts
    const hasLine = points.length >= 2;

    useEffect(() => {
        const resizeObserver = new ResizeObserver(([{contentRect}]) => setSize({
            width: contentRect.width,
            height: contentRect.height,
        }));

        resizeObserver.observe(containerRef.current);

        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        if (canvasRef.current && size.width > 0 && size.height > 0) {
            drawGraph({
                canvas: canvasRef.current,
                width: size.width,
                height: size.height,
                points,
                now,
                color,
                baselineColor: token.colorBorder,
            });
        }
    }, [color, now, points, size, token.colorBorder]);

    return (
        <div
            ref={containerRef}
            className={style.graph}
            style={{minHeight: GRAPH_MIN_HEIGHT}}
        >
            <Tooltip title={hasLine ? `Битрейт за последние ${GRAPH_SPAN_SEC / 60} мин` : null}>
                <canvas
                    ref={canvasRef}
                    className={style.canvas}
                />
            </Tooltip>

            {!hasLine && (
                <Flex
                    className={style.placeholder}
                    align="center"
                    justify="center"
                    gap="small"
                >
                    <Typography.Text type="secondary">
                        <LineChartOutlined/>
                    </Typography.Text>

                    <Typography.Text
                        type="secondary"
                        ellipsis
                    >
                        {isActive ? 'Собираем данные о битрейте…' : 'График появится, когда начнётся эфир'}
                    </Typography.Text>
                </Flex>
            )}
        </div>
    );
};

export default BitrateGraph;
