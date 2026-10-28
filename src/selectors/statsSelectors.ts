import {BaseStore} from '__reducers';

export const statsTargetsSelector = (state: BaseStore) => state.stats.targets;

export const statsViewSelector = (state: BaseStore) => state.stats.view;

export const statsHardwareSelector = (state: BaseStore) => state.stats.hardware;
