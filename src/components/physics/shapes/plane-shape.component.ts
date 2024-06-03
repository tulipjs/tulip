import p2 from "p2";
import { Function, PlaneShapeMutable, PlaneShapeProps } from "../../../types";
import { getShapeMutable } from "../../../utils";

export const planeShape: Function<PlaneShapeProps, PlaneShapeMutable> = () => {
  const shape = new p2.Plane();

  return {
    ...getShapeMutable(shape),
  };
};
