import { PlayStatus } from "../../enums";
import {
  DisplayObjectMutable,
  DisplayObjectProps,
} from "../display-object.types";
import { AnimatedSprite } from "../pixi.types";

export type AnimatedSpriteProps = {
  spriteSheet: string;
  animation: string;
  frame?: number;
  playStatus?: PlayStatus;
} & DisplayObjectProps;

export type AnimatedSpriteMutable = {
  getSpriteSheet: () => string;
  setSpriteSheet: (spriteSheet?: string) => Promise<void>;

  setAnimation: (animation: string) => void;
  getAnimation: () => string;

  setFrame: (frame: number, playStatus?: PlayStatus) => void;
  getFrame: () => number;

  setPlayStatus: (playStatus: PlayStatus) => void;
  getPlayStatus: () => PlayStatus;
} & DisplayObjectMutable<AnimatedSprite>;
