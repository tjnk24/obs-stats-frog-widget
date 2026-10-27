import connectionSlice, {ConnectionReducer} from './connectionReducer';
import settingsSlice, {SettingsReducer} from './settingsReducer';
import statsSlice, {StatsReducer} from './statsReducer';

export type BaseStore = {
    connection: ConnectionReducer;
    stats: StatsReducer;
    settings: SettingsReducer;
};

export const reducers = {
    connection: connectionSlice.reducer,
    stats: statsSlice.reducer,
    settings: settingsSlice.reducer,
};

export const actionCreators = {
    connection: connectionSlice.actions,
    stats: statsSlice.actions,
    settings: settingsSlice.actions,
};
