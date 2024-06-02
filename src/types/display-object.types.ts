import { MutableFunction } from "./mutables.types";
import { Point } from "./point.types";
import { ContainerEvent } from "./events.types";
import { EventMode } from "../enums";
import { ComponentMutable, ComponentProps } from "./component.types";

export type DisplayObjectProps = {
  pivot?: Point;
  eventMode?: EventMode;
  visible?: boolean;
  zIndex?: number;
  alpha?: number;
} & ComponentProps;

export type DisplayObjectMutable<DisplayObject> = {
  //############### RENDER ###############
  getDisplayObject: () => DisplayObject;

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
} & ComponentMutable;
