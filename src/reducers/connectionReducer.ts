import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {ConnectionStatusEnum} from '__types/ConnectionStatusEnum';

export type ConnectionReducer = {
    status: ConnectionStatusEnum;
};

const initialState: ConnectionReducer = {
    status: ConnectionStatusEnum.Connecting,
};

const slice = createSlice({
    name: 'connection',
    initialState,
    reducers: {
        setStatus: (state, {payload}: PayloadAction<ConnectionStatusEnum>) => {
            state.status = payload;
        },
    },
});

export default slice;
