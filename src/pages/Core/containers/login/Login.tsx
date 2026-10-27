import {
    Alert,
    Button,
    Card,
    Checkbox,
    Form,
    Input,
    InputRef,
    Typography,
} from 'antd';
import {useEffect, useRef} from 'react';

import {
    CONNECT_INFO_HINT,
    INITIAL_VALUES,
    PASSWORD_PLACEHOLDER,
    PASSWORD_RULES,
} from './consts';
import {LoginFormDto, Props} from './types';

import style from './style.module.scss';

const Login = ({message, isError, onSubmit}: Props) => {
    const [form] = Form.useForm<LoginFormDto>();

    const inputRef = useRef<InputRef>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, [message]);

    const onFinish = ({password, isRemember}: LoginFormDto) => {
        onSubmit(password, isRemember);

        form.resetFields(['password']);
    };

    return (
        <Card
            className={style.card}
            size="small"
            title="Подключение к OBS"
        >
            <Alert
                className={style.message}
                type={isError ? 'error' : 'info'}
                title={message}
                showIcon
            />

            <Form
                form={form}
                layout="vertical"
                initialValues={INITIAL_VALUES}
                onFinish={onFinish}
            >
                <Form.Item
                    name="password"
                    rules={PASSWORD_RULES}
                >
                    <Input.Password
                        ref={inputRef}
                        autoComplete="current-password"
                        placeholder={PASSWORD_PLACEHOLDER}
                        aria-label={PASSWORD_PLACEHOLDER}
                    />
                </Form.Item>

                <Form.Item
                    name="isRemember"
                    valuePropName="checked"
                >
                    <Checkbox>
                        Запомнить
                    </Checkbox>
                </Form.Item>

                <Button
                    type="primary"
                    htmlType="submit"
                    block
                >
                    Подключиться
                </Button>
            </Form>

            <Typography.Paragraph
                className={style.hint}
                type="secondary"
            >
                {CONNECT_INFO_HINT}
            </Typography.Paragraph>
        </Card>
    );
};

export default Login;
