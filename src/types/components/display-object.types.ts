import { MutableFunction } from "../mutables.types";
import { Point } from "../point.types";
import { Cursor, DisplayObjectEvent, EventMode } from "../../enums";
import { Size } from "../size.types";
import { DisplayObject as DO } from "../pixi.types";
import {
  AsyncComponent,
  Component,
  ComponentMutable,
  ComponentProps,
} from "./component.types";

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
  setPivot: (pivot: MutableFunction<Point>) => Promise<void>;
  setPivotX: (x: MutableFunction<number>) => Promise<void>;
  setPivotY: (y: MutableFunction<number>) => Promise<void>;
  getPivot: () => Point;
  //events
  on: <Data>(
    event: DisplayObjectEvent,
    callback: (data: Data) => void | Promise<void>,
  ) => void;
  $emit: <Data>(event: DisplayObjectEvent, data: Data) => void | Promise<void>;

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
  //cursor
  setCursor: (
    cursor: MutableFunction<Cursor>,
    ignoreWarn?: boolean,
  ) => Promise<void>;
  getCursor: () => Cursor;
  //hitArea
  setHitArea: (polygon: MutableFunction<number[]>) => Promise<void>;
  getHitArea: () => number[];
  //sortableChildren
  setSortableChildren: (
    sortableChildren: MutableFunction<boolean>,
  ) => Promise<void>;
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

export type AsyncDisplayObjectComponent<
  DisplayObject extends DO,
  Props = {},
  Mutable = {},
  Data = {},
> = AsyncComponent<
  DisplayObjectProps<Props, Data>,
  DisplayObjectMutable<DisplayObject, Props, Mutable, Data>,
  Data
>;
