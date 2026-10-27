// GetStreamServiceSettings; the stream key in it is never read
export type ObsStreamServiceDto = {
    streamServiceType: string;
    streamServiceSettings: {
        service?: string;
        server?: string;
    };
};
