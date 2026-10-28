import {PasswordChangeResultEnum} from './PasswordChangeResultEnum';

export type PasswordChangeDto = {
    password: string;
    resolve: (result: PasswordChangeResultEnum) => void;
};
