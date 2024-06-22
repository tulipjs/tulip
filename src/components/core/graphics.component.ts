import * as PIXI from "pixi.js";
import {
  Component,
  DisplayObjectMutable,
  Graphics,
  ContainerProps,
  InternalMutable,
} from "../../types";
import { getDisplayObjectMutable, setDisplayObjectProps } from "../../utils";
import { empty } from "./empty.component";

type Props = {
  color: number;

  radius?: number;
  polygon?: number[];
  length?: number;
} & ContainerProps;

type Mutable = {
  setColor: (color: number) => void;
  getColor: () => number;

  setPolygon: (polygon: number[]) => void;
  setCircle: (radius: number) => void;
  setCapsule: (length: number, radius: number) => void;
  setTriangle: (width: number, height: number) => void;
} & DisplayObjectMutable<Graphics>;

export const graphics: Component<Props, Mutable, false> = (originalProps) => {
  const {
    color: defaultColor,
    radius: defaultRadius,
    polygon: defaultPolygon,
    length: defaultLength,
    label,
    ...props
  } = originalProps;

  const $props = structuredClone(originalProps);

  let $color = defaultColor;
  let $polygon = defaultPolygon;
  let $radius = defaultRadius;
  let $length = defaultLength;

  const graphics = new PIXI.Graphics() as Graphics;

  const emptyMutable = empty({ label });

  const displayObjectMutable = getDisplayObjectMutable<Graphics>(
    graphics,
    emptyMutable,
  );
  setDisplayObjectProps<Graphics>(graphics, props, displayObjectMutable);

  const getColor = () => $color;
  const setColor = (color: number) => {
    graphics.tint = color;
  };

  const setPolygon = (polygon: number[]) => {
    graphics.clear();
    graphics.poly(polygon).fill({ color: 0xffffff });
  };
  const setCircle = (radius: number) => {
    graphics.clear();
    graphics.circle(0, 0, radius).fill({ color: 0xffffff });
  };
  const setCapsule = (length: number, radius: number) => {
    graphics.clear();
    graphics
      .rect(-length / 2, -radius, length, 2 * radius)
      .circle(-length / 2, 0, radius)
      .circle(length / 2, 0, radius)
      .fill({ color: 0xffffff });
  };
  const setTriangle = (width: number, height: number) => {
    setPolygon([-width / 2, height / 2, width / 2, height / 2, 0, -height / 2]);
  };

  const $getRaw = (): Props => {
    return {
      ...displayObjectMutable.$getRaw(),
      color: $color,
      radius: $radius,
      polygon: $polygon,
    };
  };

  const $destroy = () => {
    //remove child first
    graphics?.parent?.removeChild(graphics);
    displayObjectMutable.$destroy();
    //destroy pixi graphics
    graphics.destroy();
  };

  $color !== undefined && setColor($color);
  $polygon && setPolygon($polygon);
  $radius && !$length && setCircle($radius);
  $radius && $length && setCapsule($length, $radius);

  const mutable: InternalMutable<Mutable, false> = {
    // container
    ...displayObjectMutable,
    // graphics
    setColor,
    getColor,

    setPolygon,
    setCircle,
    setCapsule,
    setTriangle,

    // @ts-ignore
    getComponent: (component) => {
      mutable.$componentName = component.name;
      return mutable;
    },

    getProps: () => $props as any,

    $getRaw,
    $destroy,

    $mutable: false,
  };

  return mutable;
};
