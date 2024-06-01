import * as PIXI from "pixi.js";
import { Component, DisplayObjectMutable, Graphics } from "../types";
import { ContainerProps } from "./container.component";
import { getDisplayObjectMutable, setDisplayObjectProps } from "../utils";

type Props = {
  color: number;
  polygon: number[];
} & ContainerProps;

type Mutable = {
  setColor: (color: number) => void;
  getColor: () => number;

  setPolygon: (polygon: number[]) => void;
  getPolygon: () => number[];
} & DisplayObjectMutable<Graphics>;

export const graphicsComponent: Component<Props, Mutable> = ({
  color: defaultColor,
  polygon: defaultPolygon,
  ...props
}) => {
  let _color = defaultColor;
  let _polygon = defaultPolygon;

  const graphics = new PIXI.Graphics() as Graphics;
  setDisplayObjectProps<Graphics>(graphics, props);

  const render = () => {
    graphics.clear();
    graphics.poly(_polygon).fill({ color: _color });
  };
  render();

  return {
    // container
    ...getDisplayObjectMutable<Graphics>(graphics),

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
};
graphicsComponent();
