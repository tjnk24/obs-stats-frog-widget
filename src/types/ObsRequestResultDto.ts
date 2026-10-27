export type ObsRequestResultDto<T = unknown> = {
    requestType: string;
    requestStatus: {
        result: boolean;
        code: number;
        comment?: string;
    };
    responseData?: T;
};
