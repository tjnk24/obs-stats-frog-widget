import {SettingsDto} from '__types/SettingsDto';
import {SETTINGS_STORAGE_KEY} from '__utils/consts';

export const saveSettings = (settings: SettingsDto) => {
    try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch {
        return;
    }
};
