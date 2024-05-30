type SyncComponent<DisplayObject, Props, Mutable> = (
  props?: Props,
) => [DisplayObject, Mutable];

export type AsyncComponent<DisplayObject, Props, Mutable> = (
  props?: Props,
) => Promise<[DisplayObject, Mutable]>;

export type Component<DisplayObject, Props, Mutable> = SyncComponent<
  DisplayObject,
  Props,
  Mutable
>;
