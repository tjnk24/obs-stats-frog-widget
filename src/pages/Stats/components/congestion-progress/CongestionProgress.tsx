import {Progress, theme} from 'antd';

import {
    CONGESTION_BAD_SHARE,
    CONGESTION_WARN_SHARE,
    PROGRESS_SIZE,
} from './consts';
import {Props} from './types';
import {formatProgressPercent} from './utils/formatProgressPercent';

const CongestionProgress = ({value}: Props) => {
    const {token} = theme.useToken();

    const share = Math.max(0, Math.min(1, value || 0));
    const strokeColor = share < CONGESTION_WARN_SHARE ? token.colorSuccess : share < CONGESTION_BAD_SHARE ? token.colorWarning : token.colorError;

    return (
        <Progress
            percent={Math.round(share * 100)}
            // "normal" keeps the number at 100% instead of a check mark
            status="normal"
            size={PROGRESS_SIZE}
            strokeColor={strokeColor}
            format={formatProgressPercent}
        />
    );
};

export default CongestionProgress;
