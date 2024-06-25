import { MutableFunction } from "./mutables.types";
import { Point } from "./point.types";
import { DisplayObjectEvent, EventMode } from "../enums";
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
  setPivot: (pivot: MutableFunction<Point>) => Promise<void>;
  setPivotX: (x: MutableFunction<number>) => Promise<void>;
  setPivotY: (y: MutableFunction<number>) => Promise<void>;
  getPivot: () => Point;
  //events
  on: <Data>(
    event: DisplayObjectEvent,
    callback: (data: Data) => void | Promise<void>,
  ) => void;

  //visible
  setVisible: (visible: MutableFunction<boolean>) => Promise<void>;
  getVisible: () => boolean;
  //zIndex
  setZIndex: (zIndex: number) => Promise<void>;
  getZIndex: () => number;
  //alpha
  setAlpha: (alpha: number) => Promise<void>;
  getAlpha: () => number;
  //eventMode
  setEventMode: (eventMode: EventMode) => Promise<void>;
  getEventMode: () => EventMode;
} & ComponentMutable;
