import * as PIXI from "libs/pixi.mjs";
import { Component, Graphics } from "types";
import {
  ContainerMutable,
  ContainerProps,
  getContainerMutable,
  setContainerProps,
} from "./container.component";

type Props = {
  color: number;
  polygon: number[];
} & ContainerProps;

type Mutable = {
  setColor: (color: number) => void;
  getColor: () => number;

  setPolygon: (polygon: number[]) => void;
  getPolygon: () => number[];
} & ContainerMutable;

export const graphicsComponent: Component<
  Graphics,
  Props,
  Mutable
> = ({
  color: defaultColor,
  polygon: defaultPolygon,
  ...props
}) => {
  let _color = defaultColor;
  let _polygon = defaultPolygon;

  const graphics = new PIXI.Graphics();
  setContainerProps(graphics, props);

  const render = () => {
    graphics.clear();
    graphics.poly(_polygon).fill({ color: _color });
  };
  render();

  const mutable = {
    // container
    ...getContainerMutable(graphics),

    // graphics
    setColor: (color: number) => {
      _color = color;
      render();
    },
    getColor: () => _color,

    setPolygon: (polygon: number[]) => {
      _polygon = polygon;
      render();
    },
    getPolygon: () => _polygon,
  };

  return [graphics, mutable];
};
