import type {KnipConfig} from 'knip';

const config: KnipConfig = {
    project: ['src/**/*.{ts,tsx}'],
    ignoreDependencies: ['eslint-plugin-jsx-a11y'],
};

export default config;
