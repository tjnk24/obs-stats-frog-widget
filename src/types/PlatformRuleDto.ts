export type PlatformRuleDto = {
    title: string;
    color: string;
    services: RegExp;
    hosts: RegExp[];
};
