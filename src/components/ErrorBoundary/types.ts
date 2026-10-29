import type {Nullable} from 'infrastructure/common';
import {ReactNode} from 'react';

export enum CopyResultEnum {
    Copied = 'copied',
    Selected = 'selected',
}

interface OwnProps {
    children: ReactNode;
}

export type Props = OwnProps;

export type State = {
    hasError: boolean;
    report: Nullable<string>;
    copyResult: Nullable<CopyResultEnum>;
};
