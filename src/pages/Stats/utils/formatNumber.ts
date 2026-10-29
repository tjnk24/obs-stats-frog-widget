import i18n from 'i18next';

export const formatNumber = (value: number) => new Intl.NumberFormat(i18n.language).format(value);
