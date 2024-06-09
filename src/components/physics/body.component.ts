import p2 from "p2";
import {
  BodyMutable,
  BodyProps,
  Component,
  Point,
  ShapeMutable,
} from "../../types";
import { degreesToRadians } from "../../utils";

export const body: Component<BodyProps, BodyMutable> = ({
  mass,
  angle,
} = {}) => {
  const _body = new p2.Body({
    mass: mass,
    angle: angle ? degreesToRadians(angle) : 0,
  });

  const getBody = () => _body;

  const addShape = (shape: ShapeMutable) => {
    _body.addShape(shape.getShape());
    return shape;
  };
  const removeShape = (shape: ShapeMutable) => {
    _body.removeShape(shape.getShape());
  };

  const setPosition = (position: Point) => {
    _body.position = [-position?.x || 0, -position?.y || 0];
  };
  const getPosition = (): Point => ({
    x: -_body.position[0],
    y: -_body.position[1],
  });

  const getAngle = (): number => _body.angle;
  const setAngle = (angle: number) => (_body.angle = degreesToRadians(angle));

  const addForceX = (force: number) => (_body.force[0] = force);
  const addForceY = (force: number) => (_body.force[1] = force);
  const addForce = (force: Point) => (_body.force = [force.x, force.y]);

  return {
    addShape,
    removeShape,

    setPosition,
    getPosition,

    getAngle,
    setAngle,

    addForceX,
    addForceY,
    addForce,

    getBody,
  };
};
