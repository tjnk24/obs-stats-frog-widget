export type ObsOutputListItemDto = {
    outputName: string;
    outputKind: string;
    outputActive: boolean;
    outputFlags?: Record<string, boolean>;
};
