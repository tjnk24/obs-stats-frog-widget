import {Card} from 'antd';
import {useSelector} from 'react-redux';

import {statsViewSelector} from '__selectors/statsSelectors';

import LagValue from '../../components/lag-value';
import StatList, {StatItemDto} from '../../components/stat-list';
import {formatFixed} from '../../utils/formatFixed';

import {HINTS} from './consts';

const GeneralCard = () => {
    const {general: view} = useSelector(statsViewSelector);

    const items: StatItemDto[] = [
        {
            key: 'fps',
            label: 'FPS',
            value: view ? formatFixed(view.fps, 2) : '—',
        },
        {
            key: 'encoding',
            label: 'Кодировщик не успел',
            hint: HINTS.encoding,
            value: view ? <LagValue lag={view.encoding}/> : '—',
        },
        {
            key: 'rendering',
            label: 'Отрисовка не успела',
            hint: HINTS.rendering,
            value: view ? <LagValue lag={view.rendering}/> : '—',
        },
        {
            key: 'frameTime',
            label: 'Время кадра',
            value: view ? `${formatFixed(view.frameTime, 1)} мс` : '—',
        },
        {
            key: 'cpu',
            label: 'CPU',
            value: view ? `${formatFixed(view.cpu, 1)}%` : '—',
        },
    ];

    return (
        <Card
            size="small"
            title="OBS"
        >
            <StatList items={items}/>
        </Card>
    );
};

export default GeneralCard;
