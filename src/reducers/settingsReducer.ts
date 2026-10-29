import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {LanguageEnum} from '__types/LanguageEnum';
import {SettingsDto} from '__types/SettingsDto';
import {loadSettings} from '__utils/storage/loadSettings';

import {SETTINGS_SLICE_NAME} from './consts';

export type SettingsReducer = SettingsDto;

const slice = createSlice({
    name: SETTINGS_SLICE_NAME,
    initialState: loadSettings,
    reducers: {
        setPort: (state, {payload}: PayloadAction<number>) => {
            state.port = payload;
        },
        setIsShowGeneralCard: (state, {payload}: PayloadAction<boolean>) => {
            state.isShowGeneralCard = payload;
        },
        setLanguage: (state, {payload}: PayloadAction<LanguageEnum>) => {
            state.language = payload;
        },
    },
});

export default slice;
