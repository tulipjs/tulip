import * as PIXI from "pixi.js";
import {
  Function,
  DisplayObjectMutable,
  Graphics,
  ContainerProps,
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

export const graphics: Function<Props, Mutable> = ({
  color: defaultColor,
  label,
  ...props
}) => {
  let _color = defaultColor;

  const graphics = new PIXI.Graphics() as Graphics;
  graphics.tint = _color;

  const emptyMutable = empty({ label });

  const displayObjectMutable = getDisplayObjectMutable<Graphics>(
    graphics,
    emptyMutable,
  );
  setDisplayObjectProps<Graphics>(graphics, props, displayObjectMutable);

  return {
    // container
    ...displayObjectMutable,
    // graphics
    setColor: (color: number) => {
      graphics.tint = color;
    },
    getColor: () => _color,

    setPolygon: (polygon: number[]) => {
      graphics.clear();
      graphics.poly(polygon).fill({ color: 0xffffff });
    },
    setCircle: (radius: number) => {
      graphics.clear();
      graphics.circle(0, 0, radius).fill({ color: 0xffffff });
    },
  };
};
