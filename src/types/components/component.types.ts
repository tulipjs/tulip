import { MutableFunction } from "../mutables.types";
import { Point } from "../point.types";
import { BodyMutable } from "../body.types";
import { SoundMutable, SoundProps } from "../sound.types";

export type ComponentProps<Props = {}, Data = {}> = {
  id?: string;
  label?: string;
  position?: Point;
  angle?: number;
  initialData?: Data;
} & Props;

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
      | Component<Props, Mutable, Data>
      | AsyncComponent<Props, Mutable, Data>,
    mutable?: Mutable,
  ) => ComponentMutable<Props, any & { $expose: true }, Data>;
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
} & Mutable;

////////////////////////////
export type Component<Props = {}, Mutable = {}, Data = {}> = (
  props?: ComponentProps<Props, Data>,
) => ComponentMutable<Props, Mutable & { $expose: true }, Data>;

export type AsyncComponent<Props = {}, Mutable = {}, Data = {}> = (
  props?: ComponentProps & Props,
) => Promise<ComponentMutable<Props, Mutable & { $expose: true }, Data>>;
