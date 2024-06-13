import p2 from "p2";
import { Point } from "../point.types";

// Shapes
export type ShapeProps = {
  position?: Point;
  angle?: number;
};
export type ShapeMutable<Raw extends any = {}> = {
  getShape: () => p2.Shape;
};
