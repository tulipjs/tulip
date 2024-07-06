import { Graphics } from "../pixi.types";
import { GraphicType } from "../../enums";
import {
  AsyncDisplayObjectComponent,
  InternalDisplayObjectMutable,
  DisplayObjectMutable,
} from "../display-object.types";

export type PartialGraphicsProps = {
  color: number;
} & GraphicsTypesProps;

export type PartialGraphicsMutable = {
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
};

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

export type GraphicsMutable = DisplayObjectMutable<Graphics> &
  PartialGraphicsMutable;

////////////////////////////
export type InternalAsyncGraphicsMutable<
  Props = {},
  Mutable = {},
  Data = {},
> = Promise<InternalGraphicsMutable<Props, Mutable, Data>>;
export type InternalGraphicsMutable<
  Props = {},
  Mutable = {},
  Data = {},
> = InternalDisplayObjectMutable<
  Graphics,
  PartialGraphicsProps & Props,
  PartialGraphicsMutable & Mutable,
  Data
>;

////////////////////////////
export type GraphicsComponent<
  Props = {},
  Mutable = {},
  Data = {},
> = AsyncDisplayObjectComponent<
  Graphics,
  PartialGraphicsProps & Props,
  PartialGraphicsMutable & Mutable,
  Data
>;
