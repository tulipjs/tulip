import p2 from "p2";
import { Function } from "../functions.types";
import { ShapeMutable } from "./shapes.types";
import { ComponentMutable } from "../component.types";
import { Point } from "../point.types";

//
export type BodyProps = {
  mass?: number;
};
export type BodyMutable = {
  addShape: (shape: ShapeMutable) => void;
  removeShape: (shape: ShapeMutable) => void;

  setPosition: (position: Point) => void;
  getPosition: () => Point;

  getAngle: () => number;

  addForceX: (force: number) => void;
  addForceY: (force: number) => void;
  addForce: (force: Point) => void;

  getBody: () => p2.Body;
};

export type Body = Function<BodyProps, BodyMutable>;

//
type WorldProps = {
  gravity?: Point;
};

type WorldMutable = {
  add: (displayObject: ComponentMutable) => void;
  remove: (displayObject: ComponentMutable) => void;

  _step: () => void;
};
export type World = Function<WorldProps, WorldMutable>;
