import {SettingsDto} from '__types/SettingsDto';
import {DEFAULT_SETTINGS, SETTINGS_STORAGE_KEY} from '__utils/consts';

// settings saved by an older version may lack newer fields, so they are laid over the defaults
export const loadSettings = (): SettingsDto => {
    try {
        return {
            ...DEFAULT_SETTINGS,
            ...JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || '{}') as Partial<SettingsDto>,
        };
    } catch {
        return DEFAULT_SETTINGS;
    }
};
