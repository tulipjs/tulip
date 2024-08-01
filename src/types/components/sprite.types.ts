import {
  DisplayObjectComponent,
  DisplayObjectMutable,
  DisplayObjectProps,
} from "./display-object.types";
import { Sprite } from "../pixi.types";

export type PartialSpriteProps<Props = {}> = {
  spriteSheet?: string;
  texture: string;
  //When texture is base64 or it's ready to be consumed by PIXI.Texture
  raw?: boolean;
} & Props;
export type PartialSpriteMutable<Mutable = {}> = {
  setTexture: (texture?: string) => void;

  getSpriteSheet: () => string;
  setSpriteSheet: (spriteSheet?: string) => void;
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
> = DisplayObjectComponent<
  Sprite,
  SpriteProps<Props, Data>,
  SpriteMutable<Props, Mutable, Data>,
  Data
>;
