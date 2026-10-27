import {Typography} from 'antd';

import {formatNumber} from '../../utils/formatNumber';
import {formatPercent} from '../../utils/formatPercent';

import {Props} from './types';

const LagValue = ({lag}: Props) => {
    const {skipped, total, recentSkipped} = lag;

    return (
        <>
            {`${formatNumber(skipped)} (${formatPercent(skipped, total)})`}

            {recentSkipped > 0 && (
                <Typography.Text type="warning">
                    {` · +${formatNumber(recentSkipped)} за мин`}
                </Typography.Text>
            )}
        </>
    );
};

export default LagValue;
