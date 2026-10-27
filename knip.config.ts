import type {KnipConfig} from 'knip';

const config: KnipConfig = {
    project: ['src/**/*.{ts,tsx}'],
    // used by eslint.config.mjs through FlatCompat ("plugin:jsx-a11y/recommended"), which knip does not read
    ignoreDependencies: ['eslint-plugin-jsx-a11y'],
};

export default config;
