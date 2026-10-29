export type Nullable<T> = T | null;

export type DeepPartial<T> = {
    [Key in keyof T]?: T[Key] extends object ? DeepPartial<T[Key]> : T[Key];
};
