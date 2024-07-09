import { MutableFunction } from "./mutables.types";
import { Point } from "./point.types";
import { BodyMutable } from "./body.types";
import { SoundMutable, SoundProps } from "./sound.types";

export type ComponentProps = {
  id?: string;
  label?: string;
  position?: Point;
  angle?: number;
};

export type ComponentMutable<Props = {}, Mutable = {}, Data = {}> = {
  getId: () => string;

  //label
  getLabel: () => string;
  setLabel: (label: string) => void;

  setBody: (body: BodyMutable) => Promise<void>;
  getBody: () => BodyMutable;

  //position
  setPosition: (position: MutableFunction<Point>) => Promise<void>;
  setPositionX: (x: MutableFunction<number>) => Promise<void>;
  setPositionY: (y: MutableFunction<number>) => Promise<void>;
  getPosition: () => Point;

  getAngle: () => number;
  setAngle: (angle: MutableFunction<number>) => Promise<void>;

  getData: <R = Data>(selector?: (data: Data) => R) => R;
  setData: (data: Data | ((data: Data) => Data)) => void;

  addSound: (soundData: SoundProps) => Promise<SoundMutable>;
  getSound: (soundId: string) => SoundMutable[];

  getComponent?: (
    component:
      | Component<Props, Mutable & any, Data>
      | AsyncComponent<Props, Mutable & any, Data>,
    mutable?: Partial<Mutable>,
  ) => InternalMutable<Props, Mutable & any, Data, true>;
  getFather: <FProps, FMutable, FData>() => ComponentMutable<
    FProps,
    FMutable,
    FData
  >;

  /**
   * Return the original props
   */
  getProps: () => Props;

  //############### INTERNAL & DEVELOPMENT ###############

  /**
   * Returns all the props modified internally at the moment
   */
  $getRaw: () => Props;

  //Destroys the display object (pixi) & physics
  $destroy: () => void;
  //retrieves the component name (can be undefined or null). Only the added to a father will be filled
  $getComponentName: () => string | undefined;
  //TODO Search for a better name
  //It's only used for types, it doesnt contain information
  $mutable: boolean;
} & Mutable;

//--------

export type InternalMutable<
  Props,
  // @ts-ignore
  Mutable extends ComponentMutable<ComponentProps & Props, Mutable, Data>,
  Data,
  Bool,
> = Mutable & {
  $mutable: Bool;
};

export type Component<
  Props = {},
  // @ts-ignore
  Mutable extends ComponentMutable<ComponentProps & Props, Mutable, Data> = {},
  Data = {},
> = (
  props?: ComponentProps & Props,
) => InternalMutable<ComponentProps & Props, Mutable, Data, true>;

export type AsyncComponent<
  Props = {},
  // @ts-ignore
  Mutable extends ComponentMutable<ComponentProps & Props, Mutable, Data> = {},
  Data = {},
> = (
  props?: ComponentProps & Props,
) => Promise<InternalMutable<ComponentProps & Props, Mutable, Data, true>>;
