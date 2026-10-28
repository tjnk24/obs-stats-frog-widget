import {useSelector} from 'react-redux';

import {statsHardwareSelector, statsViewSelector} from '__selectors/statsSelectors';

import LagValue from '../../../components/lag-value';
import {StatItemDto} from '../../../components/stat-list';
import {formatFixed} from '../../../utils/formatFixed';
import {formatGigabytes} from '../../../utils/formatGigabytes';
import {formatMemory} from '../../../utils/formatMemory';
import {HINTS} from '../consts';

export const useItems = (): StatItemDto[] => {
    const {general: view} = useSelector(statsViewSelector);
    const {gpu, systemMemory} = useSelector(statsHardwareSelector);

    return [
        {
            key: 'fps',
            label: 'FPS',
            value: view ? formatFixed(view.fps, 2) : '—',
        },
        {
            key: 'frameTime',
            label: 'Время кадра',
            value: view ? `${formatFixed(view.frameTime, 1)} мс` : '—',
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
            key: 'cpu',
            label: 'CPU',
            value: view ? `${formatFixed(view.cpu, 1)}%` : '—',
        },
        {
            key: 'memory',
            label: 'Память OBS',
            hint: HINTS.memory,
            value: view ? formatMemory(view.memoryInMb) : '—',
        },
        ...(gpu
            ? [
                {
                    key: 'gpu',
                    label: gpu.name ? `Видеокарта (${gpu.name})` : 'Видеокарта',
                    hint: HINTS.gpu,
                    value: `${formatFixed(gpu.usage, 1)}%`,
                },
                {
                    key: 'gpuEncoder',
                    label: 'Кодирование на видеокарте',
                    hint: HINTS.gpuEncoder,
                    value: `${formatFixed(gpu.encoder, 1)}%`,
                },
                {
                    key: 'gpuMemory',
                    label: gpu.isSharedMemory ? 'Память видеокарты (общая)' : 'Видеопамять',
                    hint: gpu.isSharedMemory ? HINTS.gpuSharedMemory : undefined,
                    value: `${formatGigabytes(gpu.memoryInBytes)} ГБ`,
                },
            ]
            : []),
        ...(systemMemory
            ? [{
                key: 'systemMemory',
                label: 'Память системы',
                value: `${formatGigabytes(systemMemory.used)} из ${formatGigabytes(systemMemory.total)} ГБ`,
            }]
            : []),
    ];
};
