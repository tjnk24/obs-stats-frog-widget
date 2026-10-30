import type {KnipConfig} from 'knip';

const config: KnipConfig = {
    project: ['src/**/*.{ts,tsx}', 'webpack/**/*.ts', 'scripts/**/*.ts'],
    ignoreDependencies: ['eslint-plugin-jsx-a11y'],
};

export default config;
