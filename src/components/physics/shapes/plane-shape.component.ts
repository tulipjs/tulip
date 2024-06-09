import p2 from "p2";
import { Component, PlaneShapeMutable, PlaneShapeProps } from "../../../types";
import { getShapeMutable } from "../../../utils";

export const planeShape: Component<PlaneShapeProps, PlaneShapeMutable> = () => {
  const shape = new p2.Plane();

  const $getRaw = async (): Promise<PlaneShapeProps> => ({});
  const $setRaw = async ({}: PlaneShapeProps) => {};

  return {
    ...getShapeMutable(shape),

    $getRaw,
    $setRaw,
  };
};
