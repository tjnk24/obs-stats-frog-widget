const numberFormat = new Intl.NumberFormat('ru-RU');

export const formatNumber = (value: number) => numberFormat.format(value);

export const formatFixed = (value: number, digits: number) => value.toFixed(digits).replace('.', ',');

export const formatPercent = (part: number, total: number) => {
    if (!total) {
        return '0,0%';
    }

    const share = part / total;

    return part > 0 && share < 0.001 ? '<0,1%' : `${formatFixed(share * 100, 1)}%`;
};

export const formatTimecode = (timecode: string) => timecode?.split('.')[0] || '—';
