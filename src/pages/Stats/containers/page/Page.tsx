import {ApiOutlined, LoadingOutlined} from '@ant-design/icons';
import {Alert, Flex} from 'antd';
import {useSelector} from 'react-redux';

import {connectionStatusSelector} from '__selectors/connectionSelectors';
import {obsWebSocketPortSelector, settingsIsShowGeneralCardSelector} from '__selectors/settingsSelectors';
import {statsTargetsSelector} from '__selectors/statsSelectors';
import {ConnectionStatusEnum} from '__types/ConnectionStatusEnum';
import {
    CONNECTING_WORDING,
    RECONNECT_INTERVAL_MS,
} from '__utils/consts';

import GeneralCard from '../general-card';
import OutputCard from '../output-card';

import style from './style.module.scss';

const {Closed, Identified} = ConnectionStatusEnum;

const Page = () => {
    const status = useSelector(connectionStatusSelector);
    const port = useSelector(obsWebSocketPortSelector);
    const targets = useSelector(statsTargetsSelector);
    const isShowGeneralCard = useSelector(settingsIsShowGeneralCardSelector);

    if (status !== Identified) {
        const isClosed = status === Closed;

        return (
            <Alert
                type={isClosed ? 'error' : 'info'}
                icon={isClosed ? <ApiOutlined/> : <LoadingOutlined/>}
                title={isClosed ? `Нет связи с OBS (obs-websocket, порт ${port}). Повтор через ${RECONNECT_INTERVAL_MS / 1000} с...` : CONNECTING_WORDING}
                showIcon
            />
        );
    }

    return (
        <Flex
            className={style.page}
            gap="small"
            vertical
        >
            <div className={style.cards}>
                {targets.map(target => (
                    <OutputCard
                        key={target.key}
                        target={target}
                    />
                ))}
            </div>

            {isShowGeneralCard && <GeneralCard/>}
        </Flex>
    );
};

export default Page;
