import {obsConnectionService} from '__services/obsConnectionService';

export function onLoad() {
    obsConnectionService.start();
}

export function onDispose() {
    obsConnectionService.stop();
}
