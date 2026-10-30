import {GlobalOutlined} from '@ant-design/icons';
import {
    Card,
    Flex,
    Form,
    Select,
    Switch,
    Typography,
} from 'antd';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';

import {commonActions} from '__actions';
import EnhancedButton from '__components/EnhancedButton';
import PortField from '__components/PortField';
import {
    settingsIsMockEnabledSelector,
    settingsIsShowGeneralCardSelector,
    settingsLanguageSelector,
    settingsPortSelector,
} from '__selectors/settingsSelectors';
import {languageService} from '__services/languageService';
import {obsConnectionService} from '__services/obsConnectionService';
import {LanguageEnum} from '__types/i18n/LanguageEnum';

import DiagnosticsCard from '../diagnostics-card';
import PasswordCard from '../password-card';

import {LANGUAGE_OPTIONS} from './consts';
import {PortFormDto} from './types';

import style from './style.module.scss';

const Page = () => {
    const {t} = useTranslation();

    const port = useSelector(settingsPortSelector);
    const isShowGeneralCard = useSelector(settingsIsShowGeneralCardSelector);
    const language = useSelector(settingsLanguageSelector);
    const isMockEnabled = useSelector(settingsIsMockEnabledSelector);

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

            <Card
                size="small"
                title={t('settings.displayTitle')}
            >
                <Flex
                    gap={14}
                    vertical
                >
                    <Flex
                        align="center"
                        justify="space-between"
                        gap="small"
                    >
                        <Typography.Text>
                            <GlobalOutlined/>

                            {` ${t('settings.languageLabel')}`}
                        </Typography.Text>

                        <Select<LanguageEnum>
                            className={style.languageSelect}
                            value={languageService.resolveLanguage(language)}
                            options={LANGUAGE_OPTIONS}
                            aria-label={t('settings.languageLabel')}
                            onChange={languageService.setLanguage}
                        />
                    </Flex>

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

                    <Flex
                        align="center"
                        justify="space-between"
                        gap="small"
                    >
                        <Typography.Text>
                            {t('settings.mockMode')}
                        </Typography.Text>

                        <Switch
                            checked={isMockEnabled}
                            onChange={obsConnectionService.setMockEnabled}
                        />
                    </Flex>
                </Flex>
            </Card>

            <DiagnosticsCard/>
        </Flex>
    );
};

export default Page;
