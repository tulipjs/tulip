import { MutableFunction } from "./mutables.types";
import { Point } from "./point.types";
import { ContainerEvent } from "./events.types";
import { EventMode } from "../enums";

export type DisplayObjectProps = {
  id?: string;
  label?: string;
  position?: Point;
  pivot?: Point;
  eventMode?: EventMode;
  visible?: boolean;
  zIndex?: number;
  alpha?: number;
};

export type DisplayObjectMutable<DisplayObject> = {
  getDisplayObject: () => DisplayObject;

  //position
  setPosition: (position: MutableFunction<Point>) => void;
  setPositionX: (x: MutableFunction<number>) => void;
  setPositionY: (y: MutableFunction<number>) => void;
  getPosition: () => Point;
  //pivot
  setPivot: (pivot: MutableFunction<Point>) => void;
  setPivotX: (x: MutableFunction<number>) => void;
  setPivotY: (y: MutableFunction<number>) => void;
  getPivot: () => Point;
  //events
  on: <Data>(event: ContainerEvent, callback: (data: Data) => void) => void;
  //visible
  setVisible: (visible: MutableFunction<boolean>) => void;
  getVisible: () => boolean;
  //zIndex
  setZIndex: (zIndex: number) => void;
  getZIndex: () => number;
  //alpha
  setAlpha: (alpha: number) => void;
  getAlpha: () => number;
};
