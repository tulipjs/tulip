import p2 from "p2";
import {
  BoxShapeProps,
  CapsuleShapeProps,
  CircleShapeProps,
  ConvexShapeProps,
  PlaneShapeProps,
  ShapeProps,
  Shapes,
} from "../types";
import { Shape } from "../enums";

const getBaseProps = <Props extends ShapeProps>({
  position,
  ...props
}: Props) => ({
  ...props,
  position: position
    ? ([position.x, position.y] as [number, number])
    : undefined,
});

export const getShape = ({ type, ...props }: Shapes) => {
  if (type === Shape.CIRCLE) return getCircleShape(props as CircleShapeProps);
  if (type === Shape.PLANE) return getPlaneShape(props as PlaneShapeProps);
  if (type === Shape.BOX) return getBoxShape(props as BoxShapeProps);
  if (type === Shape.CAPSULE)
    return getCapsuleShape(props as CapsuleShapeProps);
  if (type === Shape.CONVEX) return getConvexShape(props as ConvexShapeProps);
};

export const getCircleShape = (props: CircleShapeProps): p2.Circle =>
  new p2.Circle(getBaseProps(props));

export const getPlaneShape = (props: PlaneShapeProps): p2.Plane =>
  new p2.Plane(getBaseProps(props));

export const getBoxShape = (props: BoxShapeProps): p2.Box =>
  new p2.Box(getBaseProps(props));

export const getCapsuleShape = (props: CapsuleShapeProps): p2.Capsule =>
  new p2.Capsule(getBaseProps(props));

export const getConvexShape = (props: ConvexShapeProps): p2.Convex =>
  new p2.Convex(getBaseProps(props));
