import {
    Card,
    Flex,
    Form,
    Switch,
    Typography,
} from 'antd';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';

import {commonActions} from '__actions';
import EnhancedButton from '__components/EnhancedButton';
import PortField from '__components/PortField';
import {settingsIsShowGeneralCardSelector, settingsPortSelector} from '__selectors/settingsSelectors';
import {obsConnectionService} from '__services/obsConnectionService';

import LanguageCard from '../language-card';
import PasswordCard from '../password-card';

import {PortFormDto} from './types';

const Page = () => {
    const {t} = useTranslation();

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
                title={t('settings.portTitle')}
            >
                <Form<PortFormDto>
                    form={form}
                    layout="vertical"
                    initialValues={{port}}
                >
                    <PortField extra={t('settings.portHint')}/>

                    <EnhancedButton
                        buttonProps={{
                            type: 'primary',
                            htmlType: 'submit',
                            onClick: onSubmit,
                        }}
                    >
                        {t('settings.saveAndReconnect')}
                    </EnhancedButton>
                </Form>
            </Card>

            <PasswordCard/>

            <LanguageCard/>

            <Card
                size="small"
                title={t('settings.displayTitle')}
            >
                <Flex
                    align="center"
                    justify="space-between"
                    gap="small"
                >
                    <Typography.Text>
                        {t('settings.generalCard')}
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
