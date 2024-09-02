import {
  DisplayObjectComponent,
  DisplayObjectMutable,
  DisplayObjectProps,
} from "./display-object.types";
import { NineSliceSprite } from "../pixi.types";
import { PartialSpriteMutable, PartialSpriteProps } from "./sprite.types";

export type PartialNineSliceSpriteProps<Props = {}> = PartialSpriteProps<
  {
    leftWidth: number;
    topHeight: number;
    rightWidth: number;
    bottomHeight: number;
    width: number;
    height: number;
  } & Props
>;
export type PartialNineSliceSpriteMutable<Mutable = {}> =
  PartialSpriteMutable<Mutable>;

////////////////////////////
export type NineSliceSpriteProps<Props = {}, Data = {}> = DisplayObjectProps<
  PartialNineSliceSpriteProps<Props>,
  Data
>;

export type NineSliceSpriteMutable<
  Props = {},
  Mutable = {},
  Data = {},
> = DisplayObjectMutable<
  NineSliceSprite,
  NineSliceSpriteProps<Props, Data>,
  PartialNineSliceSpriteMutable<Mutable>,
  Data
>;

////////////////////////////
export type NineSliceSpriteComponent<
  Props = {},
  Mutable = {},
  Data = {},
> = DisplayObjectComponent<
  NineSliceSprite,
  NineSliceSpriteProps<Props, Data>,
  NineSliceSpriteMutable<Props, Mutable, Data>,
  Data
>;
