import { ShapeMutable, ShapeProps } from "../types";
import p2, { SharedShapeOptions } from "p2";

export const getShapeProps = ({
  position,
  angle,
  ...props
}: ShapeProps): SharedShapeOptions => ({
  angle,
  position: [position?.x || 0, position?.y || 0],
  ...props,
});

export const getShapeMutable = (shape: p2.Shape): ShapeMutable => ({
  getShape: () => shape,
});
