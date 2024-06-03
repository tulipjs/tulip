import p2 from "p2";
import { CircleShapeMutable, CircleShapeProps, Function } from "../../../types";
import { getShapeMutable, getShapeProps } from "../../../utils";

export const circleShape: Function<CircleShapeProps, CircleShapeMutable> = ({
  radius,
  ...props
}) => {
  const shape = new p2.Circle(getShapeProps(props));

  const setRadius = (radius: number) => (shape.radius = radius);
  const getRadius = () => shape.radius;

  setRadius(radius);

  return {
    ...getShapeMutable(shape),
    setRadius,
    getRadius,
  };
};
