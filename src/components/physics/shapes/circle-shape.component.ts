import p2 from "p2";
import {
  CircleShapeMutable,
  CircleShapeProps,
  Component,
} from "../../../types";
import { getShapeMutable, getShapeProps } from "../../../utils";

export const circleShape: Component<
  CircleShapeProps,
  CircleShapeMutable<CircleShapeProps>
> = ({ radius, ...props }) => {
  const shape = new p2.Circle(getShapeProps(props));

  const setRadius = (radius: number) => (shape.radius = radius);
  const getRadius = () => shape.radius;

  setRadius(radius);

  return {
    ...getShapeMutable(shape),
    setRadius,
    getRadius,

    $mutable: true,
  };
};
