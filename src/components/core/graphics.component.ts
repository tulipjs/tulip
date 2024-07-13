import * as PIXI from "pixi.js";
import {
  Graphics,
  GraphicsCapsuleProps,
  GraphicsCircleProps,
  GraphicsPolygonProps,
  GraphicsTriangleProps,
  GraphicsProps,
  GraphicsMutable,
  GraphicsRectangleProps,
} from "../../types";
import { GraphicType } from "../../enums";
import { displayObject } from "./display-object.component";

export const graphics = async <Props = {}, Mutable = {}, Data = {}>(
  originalProps: GraphicsProps<Props, Data> = {} as GraphicsProps<Props, Data>,
): Promise<GraphicsMutable<Props, Mutable, Data>> => {
  const $displayObject = await displayObject<Graphics, GraphicsProps<Props>>({
    ...originalProps,
    displayObject: new PIXI.Graphics(),
  });

  const { type, color } = $displayObject.getProps();

  const $graphics = $displayObject.getDisplayObject({ __preventWarning: true });

  let $type: GraphicType = type;
  let $polygon: number[];
  let $radius: number;
  let $length: number;
  let $width: number;
  let $height: number;

  const getType = () => $type;

  const $clear = () => {
    $polygon = undefined;
    $radius = undefined;
    $length = undefined;
    $width = undefined;
    $height = undefined;
  };

  const getColor = () => $graphics.tint;
  const setColor = (color: number) => {
    $graphics.tint = color;
  };

  const setPolygon = (polygon: number[]) => {
    $clear();

    $type = GraphicType.POLYGON;
    $polygon = polygon;

    $graphics.clear();
    $graphics.poly(polygon).fill({ color: 0xffffff });
  };
  const setCircle = (radius: number) => {
    $clear();

    $type = GraphicType.CIRCLE;
    $radius = radius;

    $graphics.clear();
    $graphics.circle(0, 0, radius).fill({ color: 0xffffff });
  };
  const setCapsule = (length: number, radius: number) => {
    $clear();

    $type = GraphicType.CAPSULE;
    $length = length;
    $radius = radius;

    $graphics.clear();
    $graphics
      .rect(-length / 2, -radius, length, 2 * radius)
      .circle(-length / 2, 0, radius)
      .circle(length / 2, 0, radius)
      .fill({ color: 0xffffff });
  };
  const setTriangle = (width: number, height: number) => {
    $clear();

    $type = GraphicType.TRIANGLE;
    $width = width;
    $height = height;

    $graphics.clear();
    $graphics
      .poly([-width / 2, height / 2, width / 2, height / 2, 0, -height / 2])
      .fill({ color: 0xffffff });
  };
  const setRectangle = (width: number, height: number) => {
    $clear();

    $type = GraphicType.RECTANGLE;
    $width = width;
    $height = height;

    $graphics.clear();
    $graphics
      .poly([0, 0, width, 0, width, height, 0, height])
      .fill({ color: 0xffffff });
  };

  const getPolygon = () => $polygon;
  const getRadius = () => $radius;
  const getLength = () => $length;
  const getWidth = () => $width;
  const getHeight = () => $height;

  const $$destroy = $displayObject.$destroy;
  const $$getRaw = $displayObject.$getRaw;

  const $getRaw = (): GraphicsProps => ({
    ...$$getRaw(),
    color: getColor(),
    type: $type,

    polygon: $polygon,
    radius: $radius,
    length: $length,
    width: $width,
    height: $height,
  });

  const $destroy = () => {
    //remove child first
    $graphics?.parent?.removeChild($graphics);
    $$destroy();
    //destroy pixi graphics
    $graphics.destroy();
    $displayObject.getFather = () => null;
  };
  {
    color !== undefined && setColor(color);
    switch (type) {
      case GraphicType.POLYGON:
        setPolygon((originalProps as GraphicsPolygonProps).polygon);
        break;
      case GraphicType.CIRCLE:
        setCircle((originalProps as GraphicsCircleProps).radius);
        break;
      case GraphicType.CAPSULE:
        const { length, radius } = originalProps as GraphicsCapsuleProps;
        setCapsule(length, radius);
        break;
      case GraphicType.TRIANGLE:
        const triangleProps = originalProps as GraphicsTriangleProps;
        setTriangle(triangleProps.width, triangleProps.height);
        break;
      case GraphicType.RECTANGLE:
        const rectangleProps = originalProps as GraphicsRectangleProps;
        setRectangle(rectangleProps.width, rectangleProps.height);
        break;
    }
  }

  const $mutable = {
    getType,

    setColor,
    getColor,

    setPolygon,
    setCircle,
    setCapsule,
    setTriangle,

    getPolygon,
    getRadius,
    getLength,
    getWidth,
    getHeight,

    $getRaw,
    $destroy,
  } as GraphicsMutable<Props, Mutable, Data>;

  return $displayObject.getComponent(graphics, $mutable);
};
