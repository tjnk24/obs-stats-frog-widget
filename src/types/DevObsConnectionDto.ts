import type {Nullable} from 'infrastructure/common';

export type DevObsConnectionDto = {
    port: number;
    password: Nullable<string>;
};
