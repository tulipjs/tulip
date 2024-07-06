import { MutableFunction } from "./mutables.types";
import { Point } from "./point.types";
import { DisplayObjectEvent, EventMode } from "../enums";
import { ComponentMutable, ComponentProps } from "./component.types";
import { Size } from "./size.types";

export type DisplayObjectProps = {
  pivot?: Point;
  eventMode?: EventMode;
  visible?: boolean;
  zIndex?: number;
  alpha?: number;
  tint?: number;
} & ComponentProps;

export type DisplayObjectMutable<DisplayObject> = {
  //############### RENDER ###############
  /**
   * @deprecated Prevent the use of "getDisplayObject()" in favor to add more functions to do specific tasks!
   */
  getDisplayObject: (data?: { __preventWarning: boolean }) => DisplayObject;

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
  //tint
  setTint: (tint: number) => Promise<void>;
  getTint: () => number;
  //bounds
  getBounds: () => Size;
} & ComponentMutable;
