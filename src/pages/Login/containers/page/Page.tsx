import {
    Alert,
    Card,
    Checkbox,
    Flex,
    Form,
    Input,
    InputRef,
    Typography,
} from 'antd';
import {useEffect, useRef} from 'react';
import {useSelector} from 'react-redux';

import EnhancedButton from '__components/EnhancedButton';
import {connectionStatusSelector} from '__selectors/connectionSelectors';
import {obsConnectionService} from '__services/obsConnectionService';
import {ConnectionStatusEnum} from '__types/ConnectionStatusEnum';

import {
    CONNECT_INFO_HINT,
    INITIAL_VALUES,
    LOGIN_MESSAGES,
    PASSWORD_PLACEHOLDER,
    PASSWORD_RULES,
} from './consts';
import {LoginFormDto} from './types';

import style from './style.module.scss';

const Page = () => {
    const status = useSelector(connectionStatusSelector);

    const [form] = Form.useForm<LoginFormDto>();

    const message = LOGIN_MESSAGES[status] || LOGIN_MESSAGES[ConnectionStatusEnum.NeedPassword];
    const isError = status === ConnectionStatusEnum.WrongPassword;

    const inputRef = useRef<InputRef>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, [message]);

    const onFinish = ({password, isRemember}: LoginFormDto) => {
        obsConnectionService.submitPassword(password, isRemember);

        form.resetFields(['password']);
    };

    return (
        <Flex
            className={style.page}
            align="center"
            justify="center"
        >
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

                    <EnhancedButton
                        buttonProps={{
                            type: 'primary',
                            htmlType: 'submit',
                            block: true,
                        }}
                    >
                        Подключиться
                    </EnhancedButton>
                </Form>

                <Typography.Paragraph
                    className={style.hint}
                    type="secondary"
                >
                    {CONNECT_INFO_HINT}
                </Typography.Paragraph>
            </Card>
        </Flex>
    );
};

export default Page;
