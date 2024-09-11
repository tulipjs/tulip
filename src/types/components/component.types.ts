import { MutableFunction } from "../mutables.types";
import { Point } from "../point.types";
import { BodyMutable } from "../body.types";
import { SoundMutable, SoundProps } from "../sound.types";
import { ApplicationMutable } from "../application.types";

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

  setBody: (body: BodyMutable) => void;
  getBody: () => BodyMutable;

  //position
  setPosition: (position: MutableFunction<Point>) => void;
  setPositionX: (x: MutableFunction<number>) => void;
  setPositionY: (y: MutableFunction<number>) => void;
  getPosition: () => Point;

  getAngle: () => number;
  setAngle: (angle: MutableFunction<number>) => void;

  getData: <R = Data>(selector?: (data: Data) => R) => R;
  setData: (data: Data | ((data: Data) => Data)) => void;

  addSound: (soundData: SoundProps) => SoundMutable;
  getSound: (soundId: string) => SoundMutable[];

  getComponent?: (
    component: unknown,
    mutable?: Partial<ComponentMutable<Props, Mutable, Data>>,
  ) => ComponentMutable<Props, any & { $expose: true }, Data>;

  getFather: () => ComponentMutable | ApplicationMutable | null;
  $setFatherId: (id?: string) => void;

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
