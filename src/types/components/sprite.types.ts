import {
  AsyncDisplayObjectComponent,
  InternalDisplayObjectMutable,
  DisplayObjectMutable,
  DisplayObjectProps,
} from "../display-object.types";
import { Sprite } from "../pixi.types";

export type PartialSpriteProps = {
  texture: string;
};
export type PartialSpriteMutable = {
  setTexture: (texture?: string) => Promise<void>;
};

export type SpriteProps<Data = {}> = DisplayObjectProps<Data> &
  PartialSpriteProps;
export type SpriteMutable = DisplayObjectMutable<Sprite> & PartialSpriteMutable;

////////////////////////////
export type InternalAsyncSpriteMutable<
  Props = {},
  Mutable = {},
  Data = {},
> = Promise<InternalSpriteMutable<Props, Mutable, Data>>;
export type InternalSpriteMutable<
  Props = {},
  Mutable = {},
  Data = {},
> = InternalDisplayObjectMutable<
  Sprite,
  PartialSpriteProps & Props,
  PartialSpriteMutable & Mutable,
  Data
>;

////////////////////////////
export type SpriteComponent<
  Props = {},
  Mutable = {},
  Data = {},
> = AsyncDisplayObjectComponent<
  Sprite,
  PartialSpriteProps & Props,
  PartialSpriteMutable & Mutable,
  Data
>;
