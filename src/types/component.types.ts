import { MutableFunction } from "./mutables.types";
import { Point } from "./point.types";
import { BodyMutable } from "./body.types";

export type InternalMutable<Mutable, Bool> = Mutable & {
  $mutable: Bool;
};

type SyncComponent<Props, Mutable, Bool> = (
  props?: Props,
) => InternalMutable<Mutable, Bool>;
export type AsyncComponent<Props, Mutable, Bool = true> = (
  props?: Props,
) => Promise<InternalMutable<Mutable, Bool>>;
export type Component<Props, Mutable, Bool = true> = SyncComponent<
  Props,
  Mutable,
  Bool
>;

export type ComponentProps = {
  id?: string;
  label?: string;
  position?: Point;
  angle?: number;
};

export type ComponentMutable<Props extends any = {}, Data = unknown> = {
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
  setAngle: (angle: number) => void;

  getData: <R = Data>(selector?: (data: Data) => R) => R;
  setData: (data: Data | ((data: Data) => Data)) => void;

  getComponent?: <Mutable>(
    component: Component<any, Mutable> | AsyncComponent<any, Mutable>,
  ) => InternalMutable<Mutable, true>;
  getFather: () => ComponentMutable;

  getProps: <Props>() => Props;

  //############### INTERNAL & DEVELOPMENT ###############

  $getRaw: () => Props;

  //Destroys the display object (pixi) & physics
  $destroy: () => void;
  //retrieves the component name (can be undefined or null). Only the added to a father will be filled
  $componentName?: string;
  //TODO Search for a better name
  //It's only used for types, it doesnt contain information
  $mutable: boolean;
};
