import { Point } from "../point.types";
import { Shape } from "../../enums";

export type ShapeProps = {
  type: Shape;
  position?: Point;
  angle?: number;
  collisionGroup?: number;
  collisionMask?: number;
  sensor?: boolean;
  collisionResponse?: boolean;
};

export type PlaneShapeProps = {
  type: Shape.PLANE;
} & ShapeProps;

export type CircleShapeProps = {
  type: Shape.CIRCLE;
  radius?: number;
} & ShapeProps;

export type Shapes = PlaneShapeProps | CircleShapeProps;
