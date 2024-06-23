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
import { graphics } from "../components";

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

const getCircleShape = (props: CircleShapeProps): p2.Circle =>
  new p2.Circle(getBaseProps(props));

const getPlaneShape = (props: PlaneShapeProps): p2.Plane =>
  new p2.Plane(getBaseProps(props));

const getBoxShape = (props: BoxShapeProps): p2.Box =>
  new p2.Box(getBaseProps(props));

const getCapsuleShape = (props: CapsuleShapeProps): p2.Capsule =>
  new p2.Capsule(getBaseProps(props));

const getConvexShape = (props: ConvexShapeProps): p2.Convex =>
  new p2.Convex(getBaseProps(props));

export const getVisualShape = ({ type, ...props }: Shapes) => {
  if (type === Shape.CIRCLE) return getVisualCircle(props as CircleShapeProps);
  if (type === Shape.PLANE) return getVisualPlane(props as PlaneShapeProps);
  if (type === Shape.BOX) return getVisualBox(props as BoxShapeProps);
  if (type === Shape.CAPSULE)
    return getVisualCapsule(props as CapsuleShapeProps);
  if (type === Shape.CONVEX) return getVisualConvex(props as ConvexShapeProps);
};

const getVisualCircle = async (props: CircleShapeProps) => {
  const circle = await graphics({
    color: 0xff00ff,
    alpha: 0.2,
  });
  circle.setCircle(props.radius);
  return circle;
};

const getVisualPlane = async (props: PlaneShapeProps) => {
  const plane = await graphics({
    color: 0xff00ff,
    alpha: 0.2,
    angle: props.angle,
  });
  plane.setPolygon([0, 0, 10000, 0, 10000, 5, 0, 5]);
  await plane.setPivot({ x: 5000, y: 2.5 });

  return plane;
};

const getVisualBox = async (props: BoxShapeProps) => {
  const { width, height } = props;
  const box = await graphics({
    color: 0xff00ff,
    alpha: 0.2,
  });
  box.setPolygon([0, 0, width, 0, width, height, 0, height]);
  await box.setPivot({ x: width / 2, y: height / 2 });
  return box;
};

const getVisualCapsule = async (props: CapsuleShapeProps) => {
  const capsule = await graphics({
    color: 0xff00ff,
    alpha: 0.2,
  });
  capsule.setCapsule(props.length, props.radius);
  return capsule;
};

const getVisualConvex = async (props: ConvexShapeProps) => {
  const convex = await graphics({
    color: 0xff00ff,
    alpha: 0.2,
  });
  convex.setTriangle(props.width, props.height);
  return convex;
};
