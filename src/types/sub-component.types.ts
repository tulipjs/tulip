type SyncSubComponent<Props, Mutable> = (props?: Props) => Mutable;
export type AsyncSubComponent<Props, Mutable> = (
  props?: Props,
) => Promise<Mutable>;
export type SubComponent<Props, Mutable> = SyncSubComponent<Props, Mutable>;
