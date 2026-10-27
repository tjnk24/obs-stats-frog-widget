import type {Nullable} from 'infrastructure/common';

import type {RecentCounter} from '__utils/stats/RecentCounter';

import {GraphPointDto} from './GraphPointDto';
import {OutputViewDto} from './OutputViewDto';

export type OutputStateDto = {
    previous: Nullable<{
        time: number;
        bytes: number;
    }>;
    graph: GraphPointDto[];
    recent: RecentCounter;
    view: OutputViewDto;
};
