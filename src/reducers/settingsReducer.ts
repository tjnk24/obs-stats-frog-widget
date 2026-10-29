import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {storageService} from '__services/storageService';
import {LanguageEnum} from '__types/LanguageEnum';
import {SettingsDto} from '__types/SettingsDto';

import {SETTINGS_SLICE_NAME} from './consts';

export type SettingsReducer = SettingsDto;

const slice = createSlice({
    name: SETTINGS_SLICE_NAME,
    initialState: storageService.loadSettings,
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
        setIsMockEnabled: (state, {payload}: PayloadAction<boolean>) => {
            state.isMockEnabled = payload;
        },
    },
});

export default slice;
