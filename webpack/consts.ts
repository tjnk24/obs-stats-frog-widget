export const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production';

export const IS_DEV_SERVER = Boolean(process.env.WEBPACK_SERVE);

export const CONTENT_HASH = IS_DEVELOPMENT ? '' : '.[contenthash:8]';
