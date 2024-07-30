type SyncSubComponent<Props, Mutable> = (props?: Props) => Mutable;
export type SubComponent<Props, Mutable> = SyncSubComponent<Props, Mutable>;
