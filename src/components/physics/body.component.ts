import p2 from "p2";
import {
  BodyMutable,
  BodyProps,
  Function,
  Point,
  ShapeMutable,
} from "../../types";

export const body: Function<BodyProps, BodyMutable> = ({ mass } = {}) => {
  const _body = new p2.Body({
    mass: mass,
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

  const addForceX = (force: number) => (_body.force[0] = force);
  const addForceY = (force: number) => (_body.force[1] = force);
  const addForce = (force: Point) => (_body.force = [force.x, force.y]);

  return {
    addShape,
    removeShape,

    setPosition,
    getPosition,

    getAngle,

    addForceX,
    addForceY,
    addForce,

    getBody,
  };
};
