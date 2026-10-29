import {CopyOutlined} from '@ant-design/icons';
import {
    Card,
    Flex,
    Input,
    Typography,
} from 'antd';
import {TextAreaRef} from 'antd/es/input/TextArea';
import type {Nullable} from 'infrastructure/common';
import {
    useEffect,
    useRef,
    useState,
} from 'react';
import {useTranslation} from 'react-i18next';

import EnhancedButton from '__components/EnhancedButton';
import {reportService} from '__services/reportService';
import {CopyResultEnum} from '__types/CopyResultEnum';

import style from './style.module.scss';

const DiagnosticsCard = () => {
    const {t} = useTranslation();

    const [copyResult, setCopyResult] = useState<Nullable<CopyResultEnum>>(null);
    const [fallbackText, setFallbackText] = useState<Nullable<string>>(null);

    const textRef = useRef<TextAreaRef>(null);

    useEffect(() => {
        fallbackText && textRef.current?.focus({cursor: 'all'});
    }, [fallbackText]);

    const onCopy = async () => {
        const diagnostics = reportService.buildDiagnostics();
        const isCopied = await reportService.copy(diagnostics);

        setFallbackText(isCopied ? null : diagnostics);
        setCopyResult(isCopied ? CopyResultEnum.Copied : CopyResultEnum.Selected);
    };

    return (
        <Card
            size="small"
            title={t('settings.diagnosticsTitle')}
        >
            <Flex
                gap="small"
                vertical
            >
                <Typography.Text type="secondary">
                    {t('settings.diagnosticsDescription')}
                </Typography.Text>

                <div>
                    <EnhancedButton
                        buttonProps={{
                            icon: <CopyOutlined/>,
                            onClick: onCopy,
                        }}
                    >
                        {copyResult ? t(`clipboard.${copyResult}`) : t('settings.copyDiagnostics')}
                    </EnhancedButton>
                </div>

                {fallbackText && (
                    <Input.TextArea
                        ref={textRef}
                        className={style.text}
                        value={fallbackText}
                        aria-label={t('settings.diagnosticsTitle')}
                        autoSize={{minRows: 4, maxRows: 12}}
                        readOnly
                    />
                )}
            </Flex>
        </Card>
    );
};

export default DiagnosticsCard;
