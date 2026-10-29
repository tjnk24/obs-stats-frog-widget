import {CopyOutlined, ReloadOutlined} from '@ant-design/icons';
import {
    Flex,
    Input,
    Result,
} from 'antd';
import {TextAreaRef} from 'antd/es/input/TextArea';
import {t} from 'i18next';
import {
    Component,
    createRef,
    ErrorInfo,
} from 'react';

import EnhancedButton from '__components/EnhancedButton';
import {CopyResultEnum} from '__types/CopyResultEnum';
import {copyText} from '__utils/clipboard/copyText';

import {Props, State} from './types';
import {buildErrorReport} from './utils/buildErrorReport';

import style from './style.module.scss';

class ErrorBoundary extends Component<Props, State> {
    public override state: State = {
        hasError: false,
        report: null,
        copyResult: null,
    };

    private readonly reportRef = createRef<TextAreaRef>();

    public static getDerivedStateFromError(): Partial<State> {
        return {hasError: true};
    }

    public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({report: buildErrorReport(error, errorInfo.componentStack)});
    }

    private copyReport = async () => {
        const isCopied = await copyText(this.state.report ?? '');

        if (!isCopied) {
            this.reportRef.current?.focus({cursor: 'all'});
        }

        this.setState({copyResult: isCopied ? CopyResultEnum.Copied : CopyResultEnum.Selected});
    };

    public override render() {
        const {hasError, report, copyResult} = this.state;

        if (!hasError) {
            return this.props.children;
        }

        return (
            <Flex
                className={style.boundary}
                gap="small"
                vertical
            >
                <Result
                    status="error"
                    title={t('errorBoundary.title')}
                    subTitle={t('errorBoundary.description')}
                    extra={(
                        <Flex
                            justify="center"
                            gap="small"
                            wrap
                        >
                            <EnhancedButton
                                buttonProps={{
                                    type: 'primary',
                                    icon: <ReloadOutlined/>,
                                    onClick: () => window.location.reload(),
                                }}
                                withSpinner={false}
                            >
                                {t('errorBoundary.reload')}
                            </EnhancedButton>

                            <EnhancedButton
                                buttonProps={{
                                    icon: <CopyOutlined/>,
                                    onClick: this.copyReport,
                                }}
                            >
                                {copyResult ? t(`clipboard.${copyResult}`) : t('errorBoundary.copyReport')}
                            </EnhancedButton>
                        </Flex>
                    )}
                />

                {report && (
                    <Input.TextArea
                        ref={this.reportRef}
                        className={style.report}
                        value={report}
                        aria-label={t('errorBoundary.reportLabel')}
                        autoSize={{minRows: 4, maxRows: 12}}
                        readOnly
                    />
                )}
            </Flex>
        );
    }
}

export default ErrorBoundary;
