import { MutableFunction } from "./mutables.types";
import { Point } from "./point.types";
import { BodyMutable } from "./body.types";

type SyncComponent<Props, Mutable> = (props?: Props) => Mutable;
export type AsyncComponent<Props, Mutable> = (
  props?: Props,
) => Promise<Mutable>;
export type Component<Props, Mutable> = SyncComponent<Props, Mutable>;

export type ComponentProps = {
  id?: string;
  label?: string;
  position?: Point;
  angle?: number;
};

export type ComponentMutable<Raw extends any = {}> = {
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

  $setRaw: (raw: Raw) => Promise<void>;
  $getRaw: () => Promise<Raw>;
};
