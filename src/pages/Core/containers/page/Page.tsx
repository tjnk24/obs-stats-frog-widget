import {
    Badge,
    Button,
    Flex,
} from 'antd';
import isEqual from 'lodash/isEqual';
import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import {ReadyState} from 'react-use-websocket';

import {DISCOVERY_EVERY_POLLS} from '__utils/consts';
import {
    IndicatorTypeEnum,
    ObsRequestDto,
    ObsRequestResultDto,
    StreamTargetDto,
} from '__utils/types';

import ConnectionAlert from '../../components/connection-alert';
import GeneralCard from '../general-card';
import Login from '../login';
import OutputCard from '../output-card';

import {
    CHANGE_PASSWORD_WORDING,
    CONNECTED_WORDING,
    CONNECTING_WORDING,
    getClosedWording,
    OFF_OUTPUT_VIEW,
} from './consts';
import {useObsConnection} from './hooks/useObsConnection';
import {buildRequests} from './utils/buildRequests';
import {discoverTargets} from './utils/discoverTargets';
import {getObsWebSocketPort} from './utils/getObsWebSocketPort';
import {StatsTracker} from './utils/StatsTracker';

import style from './style.module.scss';

const {Loading, Critical} = IndicatorTypeEnum;

const Page = () => {
    const [port] = useState(getObsWebSocketPort);
    const [tracker] = useState(() => new StatsTracker());
    const [views, setViews] = useState(() => tracker.reset());
    const [targets, setTargets] = useState<StreamTargetDto[]>([]);

    // the poll callbacks read the cards found so far without being recreated
    const targetsRef = useRef<StreamTargetDto[]>([]);

    const getRequests = useCallback((pollIndex: number) => (
        buildRequests(targetsRef.current, pollIndex % DISCOVERY_EVERY_POLLS === 0)
    ), []);

    const onBatchResults = useCallback((requests: ObsRequestDto[], results: ObsRequestResultDto[]) => {
        const pairs = requests.map((request, index) => ({request, result: results[index]}));
        const discovered = discoverTargets(pairs);

        if (discovered && !isEqual(discovered, targetsRef.current)) {
            targetsRef.current = discovered;
            setTargets(discovered);
        }

        setViews(tracker.ingest(targetsRef.current, pairs, performance.now()));
    }, [tracker]);

    const {
        readyState,
        isIdentified,
        login,
        submitPassword,
        resetPassword,
    } = useObsConnection({port, getRequests, onBatchResults});

    // start the graphs and "last minute" counters over after every reconnect
    useEffect(() => {
        if (!isIdentified) {
            targetsRef.current = [];
            setTargets([]);
            setViews(tracker.reset());
        }
    }, [isIdentified, tracker]);

    if (login) {
        return (
            <Flex
                className={style.centered}
                align="center"
                justify="center"
            >
                <Login
                    message={login.message}
                    isError={login.isError}
                    onSubmit={submitPassword}
                />
            </Flex>
        );
    }

    if (!isIdentified) {
        const isClosed = readyState === ReadyState.CLOSED || readyState === ReadyState.CLOSING;

        return (
            <div className={style.page}>
                <ConnectionAlert
                    type={isClosed ? Critical : Loading}
                    text={isClosed ? getClosedWording(port) : CONNECTING_WORDING}
                />
            </div>
        );
    }

    return (
        <Flex
            className={style.page}
            gap={8}
            vertical
        >
            <div className={style.cards}>
                {targets.map(target => (
                    <OutputCard
                        key={target.key}
                        target={target}
                        view={views.outputs[target.key] || OFF_OUTPUT_VIEW}
                        now={views.now}
                    />
                ))}
            </div>

            <GeneralCard view={views.general}/>

            <Flex
                align="center"
                justify="space-between"
                gap={8}
            >
                <Badge
                    status="success"
                    text={CONNECTED_WORDING}
                />

                <Button
                    type="link"
                    size="small"
                    onClick={resetPassword}
                >
                    {CHANGE_PASSWORD_WORDING}
                </Button>
            </Flex>
        </Flex>
    );
};

export default Page;
