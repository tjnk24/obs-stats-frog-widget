import {formatFixed} from './formatFixed';

export const formatPercent = (part: number, total: number) => {
    if (!total) {
        return `${formatFixed(0, 1)}%`;
    }

    const share = part / total;

    return part > 0 && share < 0.001 ? `<${formatFixed(0.1, 1)}%` : `${formatFixed(share * 100, 1)}%`;
};
