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

export type ComponentMutable<Props extends any = {}> = {
  getId: () => string;

  //label
  getLabel: () => string;
  setLabel: (label: string) => void;

  //############### PHYSICS ###############
  setBody: (body: BodyMutable) => void;
  getBody: () => BodyMutable;

  //position
  setPosition: (position: MutableFunction<Point>) => void;
  setPositionX: (x: MutableFunction<number>) => void;
  setPositionY: (y: MutableFunction<number>) => void;
  getPosition: () => Point;

  getAngle: () => number;
  setAngle: (angle: number) => void;

  getComponent?: <Mutable>(
    component: Component<any, Mutable> | AsyncComponent<any, Mutable>,
  ) => InternalMutable<Mutable, true>;
  getFather: () => ComponentMutable;

  $props: Props;

  $destroy: () => void;

  $componentName?: string;
  $mutable: boolean;
};
