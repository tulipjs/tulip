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

export type BoxShapeProps = {
  type: Shape.BOX;
  width: number;
  height: number;
} & ShapeProps;

export type CapsuleShapeProps = {
  type: Shape.CAPSULE;
  length: number;
  radius: number;
} & ShapeProps;

export type ConvexShapeProps = {
  type: Shape.CONVEX;
  vertices: number[][];
  width: number;
  height: number;
} & ShapeProps;

export type Shapes =
  | PlaneShapeProps
  | CircleShapeProps
  | BoxShapeProps
  | CapsuleShapeProps
  | ConvexShapeProps;
