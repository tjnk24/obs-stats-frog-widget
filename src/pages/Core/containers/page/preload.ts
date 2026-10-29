import {obsConnectionService} from '__services/obsConnectionService';

export function onLoad() {
    void obsConnectionService.start();
}

export function onDispose() {
    obsConnectionService.stop();
}
