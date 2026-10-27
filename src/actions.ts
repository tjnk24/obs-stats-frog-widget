import {bindActionCreators} from '@reduxjs/toolkit';

import {actionCreators} from '__reducers';
import store from '__store';

export const commonActions = {
    connection: bindActionCreators(actionCreators.connection, store.dispatch),
    stats: bindActionCreators(actionCreators.stats, store.dispatch),
    settings: bindActionCreators(actionCreators.settings, store.dispatch),
};
