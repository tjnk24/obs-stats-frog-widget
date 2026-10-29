import {Typography} from 'antd';
import {useTranslation} from 'react-i18next';

import {formatNumber} from '../../utils/formatNumber';
import {formatPercent} from '../../utils/formatPercent';

import {Props} from './types';

const LagValue = ({lag}: Props) => {
    const {t} = useTranslation();

    const {skipped, total, recentSkipped} = lag;

    return (
        <>
            {`${formatNumber(skipped)} (${formatPercent(skipped, total)})`}

            {recentSkipped > 0 && (
                <Typography.Text type="warning">
                    {t('general.recentLag', {count: formatNumber(recentSkipped)})}
                </Typography.Text>
            )}
        </>
    );
};

export default LagValue;
