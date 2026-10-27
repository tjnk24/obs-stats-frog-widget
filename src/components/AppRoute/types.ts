import {ReactNode} from 'react';

interface OwnProps {
    title: string;
    isAuthRequired?: boolean;
    isLoginPage?: boolean;
    children: ReactNode;
}

export type Props = OwnProps;
