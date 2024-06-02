import p2 from "p2";
import { Point } from "../point.types";
import { Function } from "../functions.types";

//
export type ShapeProps = {
  position?: Point;
  angle?: number;
};
export type ShapeMutable = {
  getShape: () => p2.Shape;
};
export type Shape = Function<ShapeProps, ShapeMutable>;

//
type ParticleShapeProps = {} & ShapeProps;
type ParticleShapeMutable = {} & ShapeMutable;
export type ParticleShape = Function<ParticleShapeProps, ParticleShapeMutable>;

//
type CircleShapeProps = {
  radius: number;
} & ShapeProps;
type CircleShapeMutable = {
  setRadius: (radius: number) => void;
  getRadius: () => number;
} & ShapeMutable;
export type CircleShape = Function<CircleShapeProps, CircleShapeMutable>;
