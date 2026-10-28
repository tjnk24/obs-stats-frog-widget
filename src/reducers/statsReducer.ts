import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {HardwareDto} from '__types/HardwareDto';
import {StatsViewDto} from '__types/StatsViewDto';
import {StreamTargetDto} from '__types/StreamTargetDto';

export type StatsReducer = {
    targets: StreamTargetDto[];
    view: StatsViewDto;
    hardware: HardwareDto;
};

const initialState: StatsReducer = {
    targets: [],
    view: {
        outputs: {},
        general: null,
        now: 0,
    },
    hardware: {
        gpu: null,
        systemMemory: null,
    },
};

const slice = createSlice({
    name: 'stats',
    initialState,
    reducers: {
        setTargets: (state, {payload}: PayloadAction<StreamTargetDto[]>) => {
            state.targets = payload;
        },
        setView: (state, {payload}: PayloadAction<StatsViewDto>) => {
            state.view = payload;
        },
        setHardware: (state, {payload}: PayloadAction<HardwareDto>) => {
            state.hardware = payload;
        },
        reset: () => initialState,
    },
});

export default slice;
