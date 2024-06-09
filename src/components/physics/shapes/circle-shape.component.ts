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

  const $getRaw = async (): Promise<CircleShapeProps> => ({
    angle: shape.angle,
    position: { x: shape.position[0], y: shape.position[1] },
    radius: shape.radius,
  });

  const $setRaw = async ({ radius, ...props }: CircleShapeProps) => {
    const { position, angle } = getShapeProps(props);
    shape.position = position;
    shape.radius = radius;
    shape.angle = angle;
  };

  return {
    ...getShapeMutable(shape),
    setRadius,
    getRadius,

    $getRaw,
    $setRaw,
  };
};
