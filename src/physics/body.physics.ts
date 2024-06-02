import p2 from "p2";
import { Body, Point, ShapeMutable } from "../types";

export const body: Body = ({}) => {
  const _body = new p2.Body({
    mass: 100,
  });

  const getBody = () => _body;

  const addShape = (shape: ShapeMutable) => {
    _body.addShape(shape.getShape());
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

  return {
    getBody,

    addShape,
    removeShape,

    setPosition,
    getPosition,
  };
};
