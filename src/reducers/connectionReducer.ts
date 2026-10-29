import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {Nullable} from 'infrastructure/common';

import {ConnectionStatusEnum} from '__types/ConnectionStatusEnum';
import {ObsVersionDto} from '__types/ObsVersionDto';

export type ConnectionReducer = {
    status: ConnectionStatusEnum;
    obsVersion: Nullable<ObsVersionDto>;
};

const initialState: ConnectionReducer = {
    status: ConnectionStatusEnum.Connecting,
    obsVersion: null,
};

const slice = createSlice({
    name: 'connection',
    initialState,
    reducers: {
        setStatus: (state, {payload}: PayloadAction<ConnectionStatusEnum>) => {
            state.status = payload;
        },
        setObsVersion: (state, {payload}: PayloadAction<Nullable<ObsVersionDto>>) => {
            state.obsVersion = payload;
        },
    },
});

export default slice;
