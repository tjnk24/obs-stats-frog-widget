import {
    Card,
    Form,
    Select,
} from 'antd';
import i18n from 'i18next';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';

import {commonActions} from '__actions';
import EnhancedButton from '__components/EnhancedButton';
import {settingsLanguageSelector} from '__selectors/settingsSelectors';
import {resolveLanguage} from '__utils/i18n/resolveLanguage';

import {LANGUAGE_NAMES} from './consts';
import {LanguageFormDto} from './types';

import style from './style.module.scss';

const LanguageCard = () => {
    const {t} = useTranslation();

    const language = useSelector(settingsLanguageSelector);

    const [form] = Form.useForm<LanguageFormDto>();

    const options = Object.entries(LANGUAGE_NAMES).map(([value, label]) => ({value, label}));

    const onSubmit = async () => {
        const values = await form.validateFields();

        commonActions.settings.setLanguage(values.language);

        await i18n.changeLanguage(resolveLanguage(values.language));
    };

    return (
        <Card
            size="small"
            title={t('settings.languageTitle')}
        >
            <Form<LanguageFormDto>
                form={form}
                layout="vertical"
                initialValues={{language: resolveLanguage(language)}}
            >
                <Form.Item
                    name="language"
                    label={t('settings.languageLabel')}
                >
                    <Select
                        className={style.select}
                        options={options}
                    />
                </Form.Item>

                <EnhancedButton
                    buttonProps={{
                        type: 'primary',
                        htmlType: 'submit',
                        onClick: onSubmit,
                    }}
                >
                    {t('settings.apply')}
                </EnhancedButton>
            </Form>
        </Card>
    );
};

export default LanguageCard;
