import p2 from "p2";
import { CircleShape } from "../../types";
import { getShapeMutable, getShapeProps } from "../../utils";

export const circleShape: CircleShape = ({ radius, ...props }) => {
  const shape = new p2.Circle(getShapeProps(props));

  const setRadius = (radius: number) => (shape.radius = radius);
  const getRadius = () => shape.radius;

  return {
    ...getShapeMutable(shape),
    setRadius,
    getRadius,
  };
};
