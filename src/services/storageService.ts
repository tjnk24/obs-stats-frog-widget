import type {Nullable} from 'infrastructure/common';

import {SettingsDto} from '__types/app/SettingsDto';
import {
    DEFAULT_SETTINGS,
    PASSWORD_STORAGE_KEY,
    SETTINGS_STORAGE_KEY,
} from '__utils/consts';

class StorageService {
    loadPassword = () => this.getItem(PASSWORD_STORAGE_KEY);

    savePassword = (password: Nullable<string>) => (
        password === null
            ? this.removeItem(PASSWORD_STORAGE_KEY)
            : this.setItem(PASSWORD_STORAGE_KEY, password)
    );

    loadSettings = (): SettingsDto => {
        try {
            return {
                ...DEFAULT_SETTINGS,
                ...JSON.parse(this.getItem(SETTINGS_STORAGE_KEY) || '{}') as Partial<SettingsDto>,
            };
        } catch {
            return DEFAULT_SETTINGS;
        }
    };

    saveSettings = (settings: SettingsDto) => this.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));

    private getItem = (key: string): Nullable<string> => {
        try {
            return localStorage.getItem(key);
        } catch {
            return null;
        }
    };

    private setItem = (key: string, value: string) => {
        try {
            localStorage.setItem(key, value);
        } catch {
            return;
        }
    };

    private removeItem = (key: string) => {
        try {
            localStorage.removeItem(key);
        } catch {
            return;
        }
    };
}

export const storageService = new StorageService();
