import i18n from 'i18next';

export const formatFixed = (value: number, digits: number) => new Intl.NumberFormat(i18n.language, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
}).format(value);
