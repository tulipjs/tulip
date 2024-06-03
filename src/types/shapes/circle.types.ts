import { ShapeMutable, ShapeProps } from "./shapes.types";

export type CircleShapeProps = {
  radius: number;
} & ShapeProps;
export type CircleShapeMutable = {
  setRadius: (radius: number) => void;
  getRadius: () => number;
} & ShapeMutable;
