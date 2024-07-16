import {
  AsyncDisplayObjectComponent,
  DisplayObjectMutable,
  DisplayObjectProps,
} from "./display-object.types";
import { SliceSprite } from "../pixi.types";

export type PartialSliceSpriteProps<Props = {}> = {
  texture: string;
  leftWidth: number;
  topHeight: number;
  rightWidth: number;
  bottomHeight: number;
  width: number;
  height: number;
} & Props;
export type PartialSliceSpriteMutable<Mutable = {}> = {
  setTexture: (texture?: string) => Promise<void>;
} & Mutable;

////////////////////////////
export type SliceSpriteProps<Props = {}, Data = {}> = DisplayObjectProps<
  PartialSliceSpriteProps<Props>,
  Data
>;

export type SliceSpriteMutable<
  Props = {},
  Mutable = {},
  Data = {},
> = DisplayObjectMutable<
  SliceSprite,
  SliceSpriteProps<Props, Data>,
  PartialSliceSpriteMutable<Mutable>,
  Data
>;

////////////////////////////
export type SliceSpriteComponent<
  Props = {},
  Mutable = {},
  Data = {},
> = AsyncDisplayObjectComponent<
  SliceSprite,
  SliceSpriteProps<Props, Data>,
  SliceSpriteMutable<Props, Mutable, Data>,
  Data
>;
