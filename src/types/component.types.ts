import { MutableFunction } from "./mutables.types";
import { Point } from "./point.types";
import { BodyMutable } from "./body.types";

export type ComponentProps = {
  label?: string;
  position?: Point;
  angle?: number;
};

export type ComponentMutable = {
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
};
