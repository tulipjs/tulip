import { PlayStatus } from "../../enums";
import {
  AsyncDisplayObjectComponent,
  InternalDisplayObjectMutable,
  DisplayObjectMutable,
  DisplayObjectProps,
} from "../display-object.types";
import { AnimatedSprite } from "../pixi.types";

export type PartialAnimatedSpriteProps = {
  spriteSheet: string;
  animation: string;
  frame?: number;
  playStatus?: PlayStatus;
};

export type PartialAnimatedSpriteMutable = {
  getSpriteSheet: () => string;
  setSpriteSheet: (spriteSheet?: string) => Promise<void>;

  setAnimation: (animation: string) => void;
  getAnimation: () => string;

  setFrame: (frame: number, playStatus?: PlayStatus) => void;
  getFrame: () => number;

  setPlayStatus: (playStatus: PlayStatus) => void;
  getPlayStatus: () => PlayStatus;
};

export type AnimatedSpriteProps<Data = {}> = DisplayObjectProps<Data> &
  PartialAnimatedSpriteProps;

export type AnimatedSpriteMutable = DisplayObjectMutable<AnimatedSprite> &
  PartialAnimatedSpriteMutable;

////////////////////////////
export type InternalAsyncAnimatedSpriteMutable<
  Props = {},
  Mutable = {},
  Data = {},
> = Promise<InternalAnimatedSpriteMutable<Props, Mutable, Data>>;
export type InternalAnimatedSpriteMutable<
  Props = {},
  Mutable = {},
  Data = {},
> = InternalDisplayObjectMutable<
  AnimatedSprite,
  AnimatedSpriteProps<Data> & Props,
  PartialAnimatedSpriteMutable & Mutable,
  Data
>;

////////////////////////////
export type AnimatedSpriteComponent<
  Props = {},
  Mutable = {},
  Data = {},
> = AsyncDisplayObjectComponent<
  AnimatedSprite,
  PartialAnimatedSpriteProps & Props,
  PartialAnimatedSpriteMutable & Mutable,
  Data
>;
