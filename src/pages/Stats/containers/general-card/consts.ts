import {DescriptionsProps} from 'antd';

export const HINTS = {
    encoding: 'Кадры, которые кодировщик не успел сжать (Skipped frames due to encoding lag). Общие для всех площадок.',
    rendering: 'Кадры, которые OBS не успел отрисовать (Frames missed due to rendering lag).',
    memory: 'Сколько оперативной памяти занимает сам OBS (Memory Usage в окне Stats)',
    gpu: 'Загрузка видеокарты, как на вкладке «Графический процессор» в диспетчере задач. Передаёт скрипт obs-stats-bridge.lua',
    gpuEncoder: 'Загрузка аппаратного кодировщика: NVENC у NVIDIA, AMF у AMD, Quick Sync у Intel',
    gpuSharedMemory: 'У встроенной графики нет своей памяти, она берёт часть оперативной',
};

// breakpoints follow the dock width: CEF gives the dock its own window
export const STAT_COLUMNS: DescriptionsProps['column'] = {
    xs: 1,
    sm: 2,
};
