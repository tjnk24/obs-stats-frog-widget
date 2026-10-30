import {readSourceFile} from './readSourceFile.ts';

export const readRequiredRequests = () => [...readSourceFile('src/types/ObsRequestTypeEnum.ts').matchAll(/=\s*'(\w+)'/g)]
    .map(([, requestType]) => requestType);
