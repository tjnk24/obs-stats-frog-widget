const numberFormat = new Intl.NumberFormat('ru-RU');

export const formatNumber = (value: number) => numberFormat.format(value);
