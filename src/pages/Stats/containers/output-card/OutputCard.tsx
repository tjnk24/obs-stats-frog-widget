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
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';

import {statsViewSelector} from '__selectors/statsSelectors';
import {HealthLevelEnum} from '__types/HealthLevelEnum';
import {OFF_OUTPUT_VIEW, RECENT_WINDOW_SEC} from '__utils/consts';

import BitrateGraph from '../../components/bitrate-graph';
import CongestionProgress from '../../components/congestion-progress';
import StatList, {StatItemDto} from '../../components/stat-list';
import {formatNumber} from '../../utils/formatNumber';
import {formatPercent} from '../../utils/formatPercent';
import {formatTimecode} from '../../utils/formatTimecode';

import {HEALTH_TAGS, PLATFORM_MARKS} from './consts';
import {OutputStatKeyEnum, Props} from './types';
import {getTargetTag} from './utils/getTargetTag';

import style from './style.module.scss';

const {Off, Warn} = HealthLevelEnum;

const OutputCard = ({target}: Props) => {
    const {t} = useTranslation();

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
    const platformMark = PLATFORM_MARKS[title];

    const items: StatItemDto[] = [
        {
            key: OutputStatKeyEnum.Timecode,
            label: t('stats.onAir'),
            level: valueLevel,
            value: isActive ? formatTimecode(timecode) : '—',
        },
        {
            key: OutputStatKeyEnum.Dropped,
            label: t('stats.dropped'),
            hint: t('stats.hints.dropped'),
            level: valueLevel,
            value: isActive ? `${formatNumber(dropped)} (${formatPercent(dropped, total)})` : '—',
        },
        {
            key: OutputStatKeyEnum.Recent,
            label: t('stats.recent'),
            hint: t('stats.hints.recent', {seconds: RECENT_WINDOW_SEC}),
            level: isActive ? level : Off,
            value: !isActive ? '—' : recentDropped > 0 ? `${formatNumber(recentDropped)} (${formatPercent(recentDropped, recentTotal)})` : '0',
        },
        {
            key: OutputStatKeyEnum.Congestion,
            label: t('stats.congestion'),
            hint: t('stats.hints.congestion'),
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

                    {platformMark && (
                        <Tooltip title={t(platformMark.hintKey)}>
                            <span>{platformMark.emoji}</span>
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
                    {isReconnecting ? t('stats.statuses.reconnecting') : t(`stats.statuses.${level}`)}
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
                    formatter={value => (typeof value === 'number' ? formatNumber(value) : value)}
                    suffix={t('stats.bitrateUnit')}
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
