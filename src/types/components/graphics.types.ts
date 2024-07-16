import { Graphics } from "../pixi.types";
import { GraphicType } from "../../enums";
import {
  AsyncDisplayObjectComponent,
  DisplayObjectMutable,
  DisplayObjectProps,
} from "./display-object.types";

export type PartialGraphicsProps<Props = {}> = {
  color: number;
} & GraphicsTypesProps &
  Props;

export type PartialGraphicsMutable<Mutable = {}> = {
  getType: () => GraphicType;

  setColor: (color: number) => void;
  getColor: () => number;

  setPolygon: (polygon: number[]) => void;
  setCircle: (radius: number) => void;
  setCapsule: (length: number, radius: number) => void;
  setTriangle: (width: number, height: number) => void;
  setRectangle: (width: number, height: number) => void;

  getPolygon: () => number[] | undefined;
  getRadius: () => number | undefined;
  getLength: () => number | undefined;
  getWidth: () => number | undefined;
  getHeight: () => number | undefined;
} & Mutable;

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
export type GraphicsRectangleProps = {
  type: GraphicType.RECTANGLE;
  width: number;
  height: number;
};

export type GraphicsTypesProps =
  | GraphicsPolygonProps
  | GraphicsCircleProps
  | GraphicsCapsuleProps
  | GraphicsTriangleProps
  | GraphicsRectangleProps;

////////////////////////////
export type GraphicsProps<Props = {}, Data = {}> = DisplayObjectProps<
  PartialGraphicsProps<Props>,
  Data
>;

export type GraphicsMutable<
  Props = {},
  Mutable = {},
  Data = {},
> = DisplayObjectMutable<
  Graphics,
  GraphicsProps<Props, Data>,
  PartialGraphicsMutable<Mutable>,
  Data
>;

////////////////////////////
export type GraphicsComponent<
  Props = {},
  Mutable = {},
  Data = {},
> = AsyncDisplayObjectComponent<
  Graphics,
  GraphicsProps<Props, Data>,
  GraphicsMutable<Props, Mutable, Data>,
  Data
>;
