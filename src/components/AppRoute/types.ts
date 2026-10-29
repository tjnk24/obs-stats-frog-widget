import type {ParseKeys} from 'i18next';
import {ReactNode} from 'react';

interface OwnProps {
    titleKey: ParseKeys;
    isAuthRequired?: boolean;
    isLoginPage?: boolean;
    children: ReactNode;
}

export type Props = OwnProps;
