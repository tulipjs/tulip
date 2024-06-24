import { ContainerProps } from "./container.types";
import { DisplayObjectMutable } from "../display-object.types";
import { Graphics } from "../pixi.types";
import { GraphicType } from "../../enums";

export type GraphicsProps = {
  color: number;
} & ContainerProps &
  GraphicsTypesProps;

export type GraphicsMutable = {
  getType: () => GraphicType;

  setColor: (color: number) => void;
  getColor: () => number;

  setPolygon: (polygon: number[]) => void;
  setCircle: (radius: number) => void;
  setCapsule: (length: number, radius: number) => void;
  setTriangle: (width: number, height: number) => void;

  getPolygon: () => number[] | undefined;
  getRadius: () => number | undefined;
  getLength: () => number | undefined;
  getWidth: () => number | undefined;
  getHeight: () => number | undefined;
} & DisplayObjectMutable<Graphics>;

export type GraphicsPolygonProps = {
  type: GraphicType.POLYGON;
  polygon: number[];
};
export type GraphicsCircleProps = {
  type: GraphicType.CIRCLE;
  radius: number;
};
export type GraphicsCapsuleProps = {
  type: GraphicType.CAPSULE;
  radius: number;
  length: number;
};
export type GraphicsTriangleProps = {
  type: GraphicType.TRIANGLE;
  width: number;
  height: number;
};

export type GraphicsTypesProps =
  | GraphicsPolygonProps
  | GraphicsCircleProps
  | GraphicsCapsuleProps
  | GraphicsTriangleProps;
