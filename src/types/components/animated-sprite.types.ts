import { PlayStatus } from "../../enums";
import {
  AsyncDisplayObjectComponent,
  DisplayObjectMutable,
  DisplayObjectProps,
} from "./display-object.types";
import { AnimatedSprite } from "../pixi.types";

export type PartialAnimatedSpriteProps<Props = {}> = {
  spriteSheet: string;
  animation: string;
  frame?: number;
  playStatus?: PlayStatus;
} & Props;

export type PartialAnimatedSpriteMutable<Mutable = {}> = {
  getSpriteSheet: () => string;
  setSpriteSheet: (spriteSheet?: string) => Promise<void>;

  setAnimation: (animation: string) => void;
  getAnimation: () => string;

  setFrame: (frame: number, playStatus?: PlayStatus) => void;
  getFrame: () => number;

  setPlayStatus: (playStatus: PlayStatus) => void;
  getPlayStatus: () => PlayStatus;
} & Mutable;

////////////////////////////
export type AnimatedSpriteProps<Props = {}, Data = {}> = DisplayObjectProps<
  PartialAnimatedSpriteProps<Props>,
  Data
>;

export type AnimatedSpriteMutable<
  Props = {},
  Mutable = {},
  Data = {},
> = DisplayObjectMutable<
  AnimatedSprite,
  AnimatedSpriteProps<Props, Data>,
  PartialAnimatedSpriteMutable<Mutable>,
  Data
>;

////////////////////////////
export type AnimatedSpriteComponent<
  Props = {},
  Mutable = {},
  Data = {},
> = AsyncDisplayObjectComponent<
  AnimatedSprite,
  AnimatedSpriteProps<Props, Data>,
  AnimatedSpriteMutable<Props, Mutable, Data>,
  Data
>;
