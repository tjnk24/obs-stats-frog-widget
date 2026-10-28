import type {Nullable} from 'infrastructure/common';

import {ROUTES} from '__routes';
import {NavigateDto} from '__types/NavigateDto';

class RouterManager {
    private navigate: Nullable<NavigateDto> = null;

    // the router is created in index.tsx, which imports the pages that use this manager
    init = (navigate: NavigateDto) => {
        this.navigate = navigate;
    };

    goToStats = (isHref?: boolean) => this.push(ROUTES.STATS.INDEX, isHref);

    goToLogin = (isHref?: boolean) => this.push(ROUTES.LOGIN.INDEX, isHref);

    goToSettings = (isHref?: boolean) => this.push(ROUTES.SETTINGS.INDEX, isHref);

    private push = (path: string, isHref?: boolean) => {
        !isHref && void this.navigate?.(path);

        return path;
    };
}

export const routerManager = new RouterManager();

import.meta.webpackHot?.decline();
