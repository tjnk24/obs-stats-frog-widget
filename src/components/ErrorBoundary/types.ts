import type {Nullable} from 'infrastructure/common';
import {ReactNode} from 'react';

import {CopyResultEnum} from '__types/CopyResultEnum';

interface OwnProps {
    children: ReactNode;
}

export type Props = OwnProps;

export type State = {
    hasError: boolean;
    report: Nullable<string>;
    copyResult: Nullable<CopyResultEnum>;
};
