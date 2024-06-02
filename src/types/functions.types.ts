type Syncfunction<Props, Mutable> = (props?: Props) => Mutable;

export type AsyncFunction<Props, Mutable> = (props?: Props) => Promise<Mutable>;

export type Function<Props, Mutable> = Syncfunction<Props, Mutable>;
