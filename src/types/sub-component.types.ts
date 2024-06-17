type SyncSubComponent<Props, Mutable, Bool> = (props?: Props) => Mutable;
export type AsyncSubComponent<Props, Mutable, Bool = true> = (
  props?: Props,
) => Promise<Mutable>;
export type SubComponent<Props, Mutable, Bool = true> = SyncSubComponent<
  Props,
  Mutable,
  Bool
>;
