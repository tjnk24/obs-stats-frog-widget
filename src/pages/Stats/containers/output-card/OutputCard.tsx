import {
    Alert,
    Badge,
    Card,
    Flex,
    Statistic,
    Tag,
    Tooltip,
} from 'antd';
import cn from 'classnames';
import {useSelector} from 'react-redux';

import {statsViewSelector} from '__selectors/statsSelectors';
import {HealthLevelEnum} from '__types/HealthLevelEnum';
import {OFF_OUTPUT_VIEW} from '__utils/consts';

import BitrateGraph from '../../components/bitrate-graph';
import CongestionProgress from '../../components/congestion-progress';
import StatList, {StatItemDto} from '../../components/stat-list';
import {formatNumber} from '../../utils/formatNumber';
import {formatPercent} from '../../utils/formatPercent';
import {formatTimecode} from '../../utils/formatTimecode';

import {
    HEALTH_TAGS,
    PLATFORM_MARKS,
    GROUP_SEPARATOR,
    HINTS,
    RECONNECTING_WORDING,
    STATUS_WORDINGS,
} from './consts';
import {Props} from './types';
import {getTargetTag} from './utils/getTargetTag';

import style from './style.module.scss';

const {Off, Warn} = HealthLevelEnum;

const OutputCard = ({target}: Props) => {
    const {outputs, now} = useSelector(statsViewSelector);

    const view = outputs[target.key] || OFF_OUTPUT_VIEW;

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
    const healthLevel = isReconnecting ? Warn : level;
    const originTag = getTargetTag(target);

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
            classNames={{
                root: style.card,
                title: style.title,
                body: style.body,
            }}
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

                    {PLATFORM_MARKS[title] && (
                        <Tooltip title={PLATFORM_MARKS[title].hint}>
                            <span>{PLATFORM_MARKS[title].text}</span>
                        </Tooltip>
                    )}

                    <Tooltip title={originTag.hint}>
                        <Tag
                            color={originTag.color}
                            variant="outlined"
                        >
                            {originTag.text}
                        </Tag>
                    </Tooltip>
                </Flex>
            )}
            extra={(
                <Tag
                    color={HEALTH_TAGS[healthLevel].color}
                    variant={HEALTH_TAGS[healthLevel].variant}
                >
                    {isReconnecting ? RECONNECTING_WORDING : STATUS_WORDINGS[level]}
                </Tag>
            )}
        >
            <Flex
                className={style.bitrateRow}
                align="center"
                gap="middle"
            >
                <Statistic
                    value={isActive && kbps !== null ? Math.round(kbps) : '—'}
                    loading={isActive && kbps === null}
                    groupSeparator={GROUP_SEPARATOR}
                    suffix="кбит/с"
                    classNames={{
                        root: style.bitrate,
                        content: cn(style.bitrateValue, {[style.inactiveBitrate]: !isActive}),
                        suffix: style.bitrateUnit,
                    }}
                />

                <BitrateGraph
                    points={graph}
                    now={now}
                    color={color}
                    isActive={isActive}
                />
            </Flex>

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
