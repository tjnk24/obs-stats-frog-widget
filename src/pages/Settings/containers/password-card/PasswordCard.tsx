import {
    Alert,
    Card,
    Form,
    Input,
} from 'antd';
import type {Nullable} from 'infrastructure/common';
import {useState} from 'react';

import EnhancedButton from '__components/EnhancedButton';
import {obsConnectionService} from '__services/obsConnectionService';
import {PasswordChangeResultEnum} from '__types/PasswordChangeResultEnum';

import {PASSWORD_RULES, RESULT_ALERTS} from './consts';
import {PasswordFormDto} from './types';

import style from './style.module.scss';

const PasswordCard = () => {
    const [form] = Form.useForm<PasswordFormDto>();

    const [result, setResult] = useState<Nullable<PasswordChangeResultEnum>>(null);

    const onSubmit = async () => {
        const {password} = await form.validateFields();

        setResult(null);

        const changeResult = await obsConnectionService.changePassword(password);

        setResult(changeResult);

        changeResult === PasswordChangeResultEnum.Accepted && form.resetFields();
    };

    return (
        <Card
            size="small"
            title="Пароль"
        >
            <Form<PasswordFormDto>
                form={form}
                layout="vertical"
            >
                <Form.Item
                    name="password"
                    label="Пароль obs-websocket"
                    extra="Tools → WebSocket Server Settings → Server Password"
                    rules={PASSWORD_RULES}
                >
                    <Input.Password autoComplete="new-password"/>
                </Form.Item>

                {result && (
                    <Alert
                        className={style.alert}
                        {...RESULT_ALERTS[result]}
                        showIcon
                    />
                )}

                <EnhancedButton
                    buttonProps={{
                        type: 'primary',
                        htmlType: 'submit',
                        onClick: onSubmit,
                    }}
                >
                    Сменить
                </EnhancedButton>
            </Form>
        </Card>
    );
};

export default PasswordCard;
