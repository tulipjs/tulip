import p2 from "p2";
import { Point } from "./point.types";
import { ShapeMutable } from "./shapes";

export type BodyProps = {
  mass?: number;
  angle?: number;
};
export type BodyMutable = {
  addShape: (shape: ShapeMutable) => ShapeMutable;
  removeShape: (shape: ShapeMutable) => void;

  setPosition: (position: Point) => void;
  getPosition: () => Point;

  getAngle: () => number;

  addForceX: (force: number) => void;
  addForceY: (force: number) => void;
  addForce: (force: Point) => void;

  getBody: () => p2.Body;
};
