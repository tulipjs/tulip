import {
  AsyncDisplayObjectComponent,
  DisplayObjectMutable,
  DisplayObjectProps,
} from "./display-object.types";
import { Sprite } from "../pixi.types";

export type PartialSpriteProps<Props = {}> = {
  texture: string;
} & Props;
export type PartialSpriteMutable<Mutable = {}> = {
  setTexture: (texture?: string) => Promise<void>;
} & Mutable;

////////////////////////////
export type SpriteProps<Props = {}, Data = {}> = DisplayObjectProps<
  PartialSpriteProps<Props>,
  Data
>;

export type SpriteMutable<
  Props = {},
  Mutable = {},
  Data = {},
> = DisplayObjectMutable<
  Sprite,
  SpriteProps<Props, Data>,
  PartialSpriteMutable<Mutable>,
  Data
>;

////////////////////////////
export type SpriteComponent<
  Props = {},
  Mutable = {},
  Data = {},
> = AsyncDisplayObjectComponent<
  Sprite,
  SpriteProps<Props, Data>,
  SpriteMutable<Props, Mutable, Data>,
  Data
>;
