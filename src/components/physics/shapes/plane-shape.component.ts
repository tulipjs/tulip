import p2 from "p2";
import { Component, PlaneShapeMutable, PlaneShapeProps } from "../../../types";
import { getShapeMutable } from "../../../utils";

export const planeShape: Component<PlaneShapeProps, PlaneShapeMutable> = () => {
  const shape = new p2.Plane();

  return {
    ...getShapeMutable(shape),

    $mutable: true,
  };
};
