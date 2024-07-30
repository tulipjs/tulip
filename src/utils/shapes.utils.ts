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
import { GraphicType, Shape } from "../enums";
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

const getVisualCircle = (props: CircleShapeProps) =>
  graphics({
    color: 0xff00ff,
    alpha: 0.2,
    type: GraphicType.CIRCLE,
    radius: props.radius,
  });

const getVisualPlane = (props: PlaneShapeProps) => {
  const plane = graphics({
    color: 0xff00ff,
    alpha: 0.2,
    angle: props.angle,
    type: GraphicType.POLYGON,
    polygon: [0, 0, 10000, 0, 10000, 5, 0, 5],
  });
  plane.setPivot({ x: 5000, y: 2.5 });

  return plane;
};

const getVisualBox = (props: BoxShapeProps) => {
  const { width, height } = props;
  const box = graphics({
    color: 0xff00ff,
    alpha: 0.2,
    type: GraphicType.POLYGON,
    polygon: [0, 0, width, 0, width, height, 0, height],
  });
  box.setPivot({ x: width / 2, y: height / 2 });

  return box;
};

const getVisualCapsule = (props: CapsuleShapeProps) =>
  graphics({
    color: 0xff00ff,
    alpha: 0.2,
    type: GraphicType.CAPSULE,
    length: props.length,
    radius: props.radius,
  });

const getVisualConvex = (props: ConvexShapeProps) =>
  graphics({
    color: 0xff00ff,
    alpha: 0.2,
    type: GraphicType.TRIANGLE,
    width: props.width,
    height: props.height,
  });
