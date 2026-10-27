const path = require('path');

module.exports = {
    '__actions': path.resolve(__dirname, '../src/actions.ts'),
    '__components': path.resolve(__dirname, '../src/components'),
    '__pages': path.resolve(__dirname, '../src/pages'),
    '__reducers': path.resolve(__dirname, '../src/reducers'),
    '__routes': path.resolve(__dirname, '../src/routes.ts'),
    '__selectors': path.resolve(__dirname, '../src/selectors'),
    '__services': path.resolve(__dirname, '../src/services'),
    '__store': path.resolve(__dirname, '../src/store.ts'),
    '__types': path.resolve(__dirname, '../src/types'),
    '__utils': path.resolve(__dirname, '../src/utils'),
};
