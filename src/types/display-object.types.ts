import { MutableFunction } from "./mutables.types";
import { Point } from "./point.types";
import { Cursor, DisplayObjectEvent, EventMode } from "../enums";
import { Size } from "./size.types";
import {
  AsyncEmptyComponent,
  EmptyComponent,
  InternalEmptyMutable,
} from "./components/empty.types";
import { DisplayObject as DO } from "./pixi.types";
import { ComponentMutable } from "./component.types";

export type DisplayObjectProps = {
  pivot?: Point;
  eventMode?: EventMode;
  visible?: boolean;
  zIndex?: number;
  alpha?: number;
  tint?: number;
  cursor?: Cursor;
};

export type PartialDisplayObjectMutable<DisplayObject> = {
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
  setZIndex: (zIndex: MutableFunction<number>) => Promise<void>;
  getZIndex: () => number;
  //alpha
  setAlpha: (alpha: MutableFunction<number>) => Promise<void>;
  getAlpha: () => number;
  //eventMode
  setEventMode: (eventMode: MutableFunction<EventMode>) => Promise<void>;
  getEventMode: () => EventMode;
  //tint
  setTint: (tint: MutableFunction<number>) => Promise<void>;
  getTint: () => number;
  //bounds
  getBounds: () => Size;
  //
  setCursor: (
    cursor: MutableFunction<Cursor>,
    ignoreWarn?: boolean,
  ) => Promise<void>;
  getCursor: () => Cursor;
};

export type DisplayObjectMutable<DisplayObject> =
  PartialDisplayObjectMutable<DisplayObject> & ComponentMutable;

////////////////////////////
export type InternalAsyncDisplayObjectMutable<
  DisplayObject extends DO,
  Props = {},
  Mutable = {},
  Data = {},
> = Promise<InternalDisplayObjectMutable<DisplayObject, Props, Mutable, Data>>;

export type InternalDisplayObjectMutable<
  DisplayObject extends DO,
  Props = {},
  Mutable = {},
  Data = {},
> = InternalEmptyMutable<
  DisplayObjectProps & Props,
  PartialDisplayObjectMutable<DisplayObject> & Mutable,
  Data
>;

////////////////////////////
export type DisplayObjectComponent<
  DisplayObject extends DO,
  Props = {},
  Mutable = {},
  Data = {},
> = EmptyComponent<
  DisplayObjectProps & Props,
  PartialDisplayObjectMutable<DisplayObject> & Mutable,
  Data
>;

export type AsyncDisplayObjectComponent<
  DisplayObject extends DO,
  Props = {},
  Mutable = {},
  Data = {},
> = AsyncEmptyComponent<
  DisplayObjectProps & Props,
  PartialDisplayObjectMutable<DisplayObject> & Mutable,
  Data
>;
