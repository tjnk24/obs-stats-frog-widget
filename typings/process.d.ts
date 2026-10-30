type WebpackProcessEnv = {
    NODE_ENV: string;
    IS_DEV_SERVER: boolean;
    APP_VERSION: string;
};

type WebpackProcess = {
    env: WebpackProcessEnv;
};

declare const process: WebpackProcess;
