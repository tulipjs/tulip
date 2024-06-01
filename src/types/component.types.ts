type SyncComponent<Props, Mutable> = (
  props?: Props,
) => Mutable;

export type AsyncComponent<Props, Mutable> = (
  props?: Props,
) => Promise<Mutable>;

export type Component<Props, Mutable> = SyncComponent<
  Props,
  Mutable
>;
