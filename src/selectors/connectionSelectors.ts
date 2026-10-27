import {BaseStore} from '__reducers';

export const connectionStatusSelector = (state: BaseStore) => state.connection.status;
