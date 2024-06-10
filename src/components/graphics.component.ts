import * as PIXI from "pixi.js";
import {
  Component,
  DisplayObjectMutable,
  Graphics,
  ContainerProps,
  InternalMutable,
} from "../types";
import { getDisplayObjectMutable, setDisplayObjectProps } from "../utils";
import { empty } from "./empty.component";

type Props = {
  color: number;
} & ContainerProps;

type Mutable = {
  setColor: (color: number) => void;
  getColor: () => number;

  setPolygon: (polygon: number[]) => void;
  setCircle: (radius: number) => void;
} & DisplayObjectMutable<Graphics>;

type RawProps = {
  radius?: number;
  polygon?: number[];
} & Props;

export const graphics: Component<Props, Mutable, false> = (originalProps) => {
  const { color: defaultColor, label, ...props } = originalProps;

  const $props = structuredClone(originalProps);

  let _color = defaultColor;
  let _polygon;
  let _radius;

  const graphics = new PIXI.Graphics() as Graphics;
  graphics.tint = _color;

  const emptyMutable = empty({ label });

  const displayObjectMutable = getDisplayObjectMutable<Graphics>(
    graphics,
    emptyMutable,
  );
  setDisplayObjectProps<Graphics>(graphics, props, displayObjectMutable);

  const getColor = () => _color;
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

  const $setRaw = async ({ color, radius, polygon, ...raw }: RawProps) => {
    await displayObjectMutable.$setRaw(raw);
    setColor(color);
    polygon && setPolygon(polygon);
    radius && setCircle(radius);
  };

  const $getRaw = async (): Promise<RawProps> => ({
    ...(await displayObjectMutable.$getRaw()),
    color: getColor(),
    radius: _radius,
    polygon: _polygon,
  });

  const mutable: InternalMutable<Mutable, false> = {
    // container
    ...displayObjectMutable,
    // graphics
    setColor,
    getColor,

    setPolygon,
    setCircle,

    $getRaw,
    $setRaw,

    // @ts-ignore
    getComponent: (component) => {
      mutable.$componentName = component.name;
      return mutable;
    },

    $props,
    $mutable: false,
    $destroy: () => {
      emptyMutable.$destroy();
      graphics.destroy();
    },
  };

  return mutable;
};
