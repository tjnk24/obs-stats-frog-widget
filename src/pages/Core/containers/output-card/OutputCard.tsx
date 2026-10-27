import {
    Alert,
    Badge,
    Card,
    Flex,
    Statistic,
    theme,
} from 'antd';

import {
    formatNumber,
    formatPercent,
    formatTimecode,
} from '__utils/formatters';
import {HealthLevelEnum} from '__utils/types';

import BitrateGraph from '../../components/bitrate-graph';
import CongestionProgress from '../../components/congestion-progress';
import HealthTag from '../../components/health-tag';
import OriginTag from '../../components/origin-tag';
import StatList, {StatItemDto} from '../../components/stat-list';

import {
    CARD_STYLES,
    GROUP_SEPARATOR,
    HINTS,
    RECONNECTING_WORDING,
    STATUS_WORDINGS,
} from './consts';
import {Props} from './types';
import {getTargetTag} from './utils/getTargetTag';

import style from './style.module.scss';

const {Off, Warn} = HealthLevelEnum;

const OutputCard = ({target, view, now}: Props) => {
    const {token} = theme.useToken();

    const {platform, notes} = target;
    const {title, color} = platform;

    const {
        isActive,
        isReconnecting,
        level,
        kbps,
        timecode,
        dropped,
        total,
        recentDropped,
        recentTotal,
        congestion,
        graph,
    } = view;

    const valueLevel = isActive ? undefined : Off;

    const items: StatItemDto[] = [
        {
            key: 'timecode',
            label: 'В эфире',
            level: valueLevel,
            value: isActive ? formatTimecode(timecode) : '—',
        },
        {
            key: 'dropped',
            label: 'Потеряно (сеть)',
            hint: HINTS.dropped,
            level: valueLevel,
            value: isActive ? `${formatNumber(dropped)} (${formatPercent(dropped, total)})` : '—',
        },
        {
            key: 'recent',
            label: 'За минуту',
            hint: HINTS.recent,
            level: isActive ? level : Off,
            value: !isActive ? '—' : recentDropped > 0 ? `${formatNumber(recentDropped)} (${formatPercent(recentDropped, recentTotal)})` : '0',
        },
        {
            key: 'congestion',
            label: 'Затор в сети',
            hint: HINTS.congestion,
            level: valueLevel,
            value: isActive ? <CongestionProgress value={congestion}/> : '—',
        },
    ];

    return (
        <Card
            size="small"
            styles={CARD_STYLES}
            title={(
                <Flex
                    wrap
                    align="center"
                    gap={6}
                >
                    <Badge
                        color={color}
                        text={title}
                    />

                    <OriginTag tag={getTargetTag(target)}/>
                </Flex>
            )}
            extra={(
                <HealthTag
                    level={isReconnecting ? Warn : level}
                    text={isReconnecting ? RECONNECTING_WORDING : STATUS_WORDINGS[level]}
                />
            )}
        >
            <Statistic
                value={isActive && kbps !== null ? Math.round(kbps) : '—'}
                loading={isActive && kbps === null}
                groupSeparator={GROUP_SEPARATOR}
                suffix="кбит/с"
                styles={{
                    content: {color: isActive ? undefined : token.colorTextTertiary},
                    suffix: {fontSize: token.fontSize, color: token.colorTextTertiary},
                }}
            />

            <BitrateGraph
                points={graph}
                now={now}
                color={color}
            />

            <StatList items={items}/>

            {notes.map(({text, type}) => (
                <Alert
                    key={text}
                    className={style.note}
                    type={type}
                    title={text}
                    showIcon
                />
            ))}
        </Card>
    );
};

export default OutputCard;
