interface OwnProps {
    message: string;
    isError?: boolean;
    onSubmit: (password: string, isRemember: boolean) => void;
}

export type Props = OwnProps;

export type LoginFormDto = {
    password: string;
    isRemember: boolean;
};
