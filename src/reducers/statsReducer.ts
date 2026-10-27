import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {StatsViewDto} from '__types/StatsViewDto';
import {StreamTargetDto} from '__types/StreamTargetDto';

export type StatsReducer = {
    targets: StreamTargetDto[];
    view: StatsViewDto;
};

const initialState: StatsReducer = {
    targets: [],
    view: {
        outputs: {},
        general: null,
        now: 0,
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
        reset: () => initialState,
    },
});

export default slice;
