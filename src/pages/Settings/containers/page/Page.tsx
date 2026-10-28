import {
    Card,
    Flex,
    Form,
    Switch,
    Typography,
} from 'antd';
import {useSelector} from 'react-redux';

import {commonActions} from '__actions';
import EnhancedButton from '__components/EnhancedButton';
import PortField from '__components/PortField';
import {settingsIsShowGeneralCardSelector, settingsPortSelector} from '__selectors/settingsSelectors';
import {obsConnectionService} from '__services/obsConnectionService';

import PasswordCard from '../password-card';

import {PortFormDto} from './types';

const Page = () => {
    const port = useSelector(settingsPortSelector);
    const isShowGeneralCard = useSelector(settingsIsShowGeneralCardSelector);

    const [form] = Form.useForm<PortFormDto>();

    const onSubmit = async () => {
        const values = await form.validateFields();

        obsConnectionService.setPort(values.port);
    };

    return (
        <Flex
            gap="small"
            vertical
        >
            <Card
                size="small"
                title="Порт"
            >
                <Form<PortFormDto>
                    form={form}
                    layout="vertical"
                    initialValues={{port}}
                >
                    <PortField extra="Tools → WebSocket Server Settings → Server Port"/>

                    <EnhancedButton
                        buttonProps={{
                            type: 'primary',
                            htmlType: 'submit',
                            onClick: onSubmit,
                        }}
                    >
                        Сохранить и переподключиться
                    </EnhancedButton>
                </Form>
            </Card>

            <PasswordCard/>

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
