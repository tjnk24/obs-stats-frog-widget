import {configureStore, createListenerMiddleware} from '@reduxjs/toolkit';

import {BaseStore, reducers} from '__reducers';
import {SETTINGS_SLICE_NAME} from '__reducers/consts';
import {storageService} from '__services/storageService';

const settingsListener = createListenerMiddleware();

settingsListener.startListening({
    predicate: ({type}) => type.startsWith(`${SETTINGS_SLICE_NAME}/`),
    effect: (_action, {getState}) => storageService.saveSettings((getState() as BaseStore).settings),
});

const store = configureStore({
    reducer: reducers,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(settingsListener.middleware),
});

export const getStore = () => store.getState();

export default store;

import.meta.webpackHot?.decline();
