import type {Nullable} from 'infrastructure/common';

import type {RecentCounter} from '__utils/stats/RecentCounter';

import {GraphPointDto} from '../views/GraphPointDto';
import {OutputViewDto} from '../views/OutputViewDto';

import {OutputBytesSampleDto} from './OutputBytesSampleDto';

export type OutputStateDto = {
    previous: Nullable<OutputBytesSampleDto>;
    graph: GraphPointDto[];
    recent: RecentCounter;
    view: OutputViewDto;
};
