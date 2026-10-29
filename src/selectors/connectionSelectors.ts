import {BaseStore} from '__reducers';

export const connectionStatusSelector = (state: BaseStore) => state.connection.status;

export const connectionObsVersionSelector = (state: BaseStore) => state.connection.obsVersion;
