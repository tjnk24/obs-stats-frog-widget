import {OutputStateDto} from '__types/OutputStateDto';
import {OFF_OUTPUT_VIEW, RECENT_WINDOW_SEC} from '__utils/consts';

import {RecentCounter} from '../RecentCounter';

export const createOutputState = (): OutputStateDto => ({
    previous: null,
    graph: [],
    recent: new RecentCounter(RECENT_WINDOW_SEC),
    view: OFF_OUTPUT_VIEW,
});
