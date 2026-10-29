module.exports = {
    'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        IS_DEV_SERVER: JSON.stringify(Boolean(process.env.WEBPACK_SERVE)),
    },
};
