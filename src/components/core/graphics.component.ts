import * as PIXI from "pixi.js";
import {
  AsyncComponent,
  Graphics,
  GraphicsCapsuleProps,
  GraphicsCircleProps,
  GraphicsMutable,
  GraphicsPolygonProps,
  GraphicsProps,
  GraphicsTriangleProps,
  InternalMutable,
} from "../../types";
import { initDisplayObjectMutable } from "../../utils";
import { empty } from "./empty.component";
import { GraphicType } from "../../enums";

export const graphics: AsyncComponent<
  GraphicsProps,
  GraphicsMutable,
  false
> = async (originalProps) => {
  const {
    // color: defaultColor,
    // radius: defaultRadius,
    // polygon: defaultPolygon,
    // length: defaultLength,
    color,
    type,
  } = originalProps;

  const $props = structuredClone(originalProps);

  let $type: GraphicType = type;
  let $polygon: number[];
  let $radius: number;
  let $length: number;
  let $width: number;
  let $height: number;

  const graphics = new PIXI.Graphics() as Graphics;

  const emptyMutable = empty(originalProps);

  const displayObjectMutable = await initDisplayObjectMutable<Graphics>(
    graphics,
    emptyMutable,
  );

  const getType = () => $type;

  const $clear = () => {
    $polygon = undefined;
    $radius = undefined;
    $length = undefined;
    $width = undefined;
    $height = undefined;
  };

  const getColor = () => graphics.tint;
  const setColor = (color: number) => {
    graphics.tint = color;
  };

  const setPolygon = (polygon: number[]) => {
    $clear();

    $type = GraphicType.POLYGON;
    $polygon = polygon;

    graphics.clear();
    graphics.poly(polygon).fill({ color: 0xffffff });
  };
  const setCircle = (radius: number) => {
    $clear();

    $type = GraphicType.CIRCLE;
    $radius = radius;

    graphics.clear();
    graphics.circle(0, 0, radius).fill({ color: 0xffffff });
  };
  const setCapsule = (length: number, radius: number) => {
    $clear();

    $type = GraphicType.CAPSULE;
    $length = length;
    $radius = radius;

    graphics.clear();
    graphics
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

    graphics.clear();
    graphics
      .poly([-width / 2, height / 2, width / 2, height / 2, 0, -height / 2])
      .fill({ color: 0xffffff });
  };

  const getPolygon = () => $polygon;
  const getRadius = () => $radius;
  const getLength = () => $length;
  const getWidth = () => $width;
  const getHeight = () => $height;

  const $getRaw = (): GraphicsProps => {
    return {
      ...displayObjectMutable.$getRaw(),
      color: getColor(),
      type: $type,

      polygon: $polygon,
      radius: $radius,
      length: $length,
      width: $width,
      height: $height,
    };
  };

  const getComponent = (component) => {
    emptyMutable.getComponent(component);
    return $mutable;
  };

  const $destroy = () => {
    //remove child first
    graphics?.parent?.removeChild(graphics);
    displayObjectMutable.$destroy();
    //destroy pixi graphics
    graphics.destroy();
    $mutable.getFather = null;
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
        const { width, height } = originalProps as GraphicsTriangleProps;
        setTriangle(width, height);
        break;
    }
  }

  const $mutable: InternalMutable<GraphicsMutable, false> = {
    // container
    ...displayObjectMutable,

    getType,

    // graphics
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

    getProps: () => $props as any,

    //@ts-ignore
    getComponent,

    $getRaw,
    $destroy,

    $mutable: false,
  };

  return $mutable;
};
