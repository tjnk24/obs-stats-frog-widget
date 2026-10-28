import {
    Alert,
    Card,
    Flex,
    Form,
    InputNumber,
    Switch,
    Typography,
} from 'antd';
import {useSelector} from 'react-redux';

import {commonActions} from '__actions';
import EnhancedButton from '__components/EnhancedButton';
import {settingsIsShowGeneralCardSelector, settingsPortSelector} from '__selectors/settingsSelectors';
import {obsConnectionService} from '__services/obsConnectionService';
import {getObsWebSocketPort} from '__utils/getObsWebSocketPort';
import {routerManager} from '__utils/infrastructure/routing/routeManager';

import {PORT_RULES} from './consts';
import {PortFormDto} from './types';

import style from './style.module.scss';

const Page = () => {
    const port = useSelector(settingsPortSelector);
    const isShowGeneralCard = useSelector(settingsIsShowGeneralCardSelector);

    const portOverride = getObsWebSocketPort();

    return (
        <Flex
            gap="small"
            vertical
        >
            <Card
                size="small"
                title="Подключение"
            >
                <Form<PortFormDto>
                    layout="vertical"
                    initialValues={{port}}
                    onFinish={values => obsConnectionService.setPort(values.port)}
                >
                    <Form.Item
                        name="port"
                        label="Порт obs-websocket"
                        extra="Tools → WebSocket Server Settings → Server Port"
                        rules={PORT_RULES}
                    >
                        <InputNumber
                            className={style.portInput}
                            min={1}
                            max={65535}
                            precision={0}
                        />
                    </Form.Item>

                    {portOverride !== null && (
                        <Alert
                            className={style.alert}
                            type="info"
                            title={`Сейчас порт ${portOverride} задан в адресе панели (?port=) и важнее этой настройки.`}
                            showIcon
                        />
                    )}

                    <Flex
                        gap="small"
                        wrap
                    >
                        <EnhancedButton
                            buttonProps={{
                                type: 'primary',
                                htmlType: 'submit',
                            }}
                        >
                            Сохранить и переподключиться
                        </EnhancedButton>

                        <EnhancedButton
                            buttonProps={{
                                onClick: () => {
                                    obsConnectionService.resetPassword();
                                    routerManager.goToLogin();
                                },
                            }}
                        >
                            Сменить пароль
                        </EnhancedButton>
                    </Flex>
                </Form>
            </Card>

            <Card
                size="small"
                title="Отображение"
            >
                <Flex
                    align="center"
                    justify="space-between"
                    gap="small"
                >
                    <Typography.Text>
                        Карточка OBS (FPS, лаги, CPU)
                    </Typography.Text>

                    <Switch
                        checked={isShowGeneralCard}
                        onChange={commonActions.settings.setIsShowGeneralCard}
                    />
                </Flex>
            </Card>
        </Flex>
    );
};

export default Page;
