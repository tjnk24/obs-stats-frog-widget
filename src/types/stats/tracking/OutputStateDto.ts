import type {Nullable} from 'infrastructure/common';

import type {RecentCounter} from '__utils/stats/RecentCounter';

import {GraphPointDto} from './GraphPointDto';
import {OutputBytesSampleDto} from './OutputBytesSampleDto';
import {OutputViewDto} from './OutputViewDto';

export type OutputStateDto = {
    previous: Nullable<OutputBytesSampleDto>;
    graph: GraphPointDto[];
    recent: RecentCounter;
    view: OutputViewDto;
};
