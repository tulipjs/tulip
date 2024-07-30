import { MutableFunction } from "../mutables.types";
import { Point } from "../point.types";
import { Cursor, DisplayObjectEvent, EventMode } from "../../enums";
import { Size } from "../size.types";
import { DisplayObject as DO } from "../pixi.types";
import { Component, ComponentMutable, ComponentProps } from "./component.types";

export type PartialDisplayObjectProps = {
  displayObject?: DO;
  pivot?: Point;
  eventMode?: EventMode;
  visible?: boolean;
  zIndex?: number;
  alpha?: number;
  tint?: number;
  cursor?: Cursor;
  hitArea?: number[];
  sortableChildren?: boolean;

  focused?: boolean;
  withContext?: boolean;
};

export type PartialDisplayObjectMutable<DisplayObject, Mutable = {}> = {
  //############### RENDER ###############
  /**
   * @deprecated Prevent the use of "getDisplayObject()" in favor to add more functions to do specific tasks!
   */
  getDisplayObject: (data?: { __preventWarning: boolean }) => DisplayObject;

  //pivot
  setPivot: (pivot: MutableFunction<Point>) => void;
  setPivotX: (x: MutableFunction<number>) => void;
  setPivotY: (y: MutableFunction<number>) => void;
  getPivot: () => Point;
  //events
  on: <Data>(event: DisplayObjectEvent, callback: (data: Data) => void) => void;
  $emit: <Data>(event: DisplayObjectEvent, data: Data) => void;

  //visible
  setVisible: (visible: MutableFunction<boolean>) => void;
  getVisible: () => boolean;
  //zIndex
  setZIndex: (zIndex: MutableFunction<number>) => void;
  getZIndex: () => number;
  //alpha
  setAlpha: (alpha: MutableFunction<number>) => void;
  getAlpha: () => number;
  //eventMode
  setEventMode: (eventMode: MutableFunction<EventMode>) => void;
  getEventMode: () => EventMode;
  //tint
  setTint: (tint: MutableFunction<number>) => void;
  getTint: () => number;
  //bounds
  getBounds: () => Size;
  //cursor
  setCursor: (cursor: MutableFunction<Cursor>, ignoreWarn?: boolean) => void;
  getCursor: () => Cursor;
  //hitArea
  setHitArea: (polygon: MutableFunction<number[]>) => void;
  getHitArea: () => number[];
  //sortableChildren
  setSortableChildren: (sortableChildren: MutableFunction<boolean>) => void;
  isSortableChildren: () => boolean;
  sortChildren: () => void;
  //mask
  setMask: (
    displayObject: DisplayObjectMutable<DO, unknown, unknown, unknown>,
  ) => void;
  removeMask: () => void;
  //global position
  getGlobalPosition: () => Point;

  //context
  focus: () => void;
  blur: () => void;
  isFocused: () => boolean;
  setWithContext: (withContext: MutableFunction<boolean>) => Promise<void>;
  getWithContext: () => boolean;
} & Mutable;

////////////////////////////
export type DisplayObjectProps<Props = {}, Data = {}> = ComponentProps<
  PartialDisplayObjectProps & Props,
  Data
>;

export type DisplayObjectMutable<
  DisplayObject extends DO,
  Props = {},
  Mutable = {},
  Data = {},
> = ComponentMutable<
  DisplayObjectProps<Props, Data>,
  PartialDisplayObjectMutable<DisplayObject, Mutable>,
  Data
>;

////////////////////////////
export type DisplayObjectComponent<
  DisplayObject extends DO,
  Props = {},
  Mutable = {},
  Data = {},
> = Component<
  DisplayObjectProps<Props, Data>,
  DisplayObjectMutable<DisplayObject, Props, Mutable, Data>,
  Data
>;
