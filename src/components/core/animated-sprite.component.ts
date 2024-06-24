import * as PIXI from "pixi.js";
import {
  AnimatedSprite,
  AsyncComponent,
  DisplayObjectMutable,
  DisplayObjectProps,
  InternalMutable,
} from "../../types";
import { empty } from "./empty.component";
import { initDisplayObjectMutable } from "../../utils";
import { PlayStatus } from "../../enums";

type Props = {
  spriteSheet: string;
  animation: string;
  frame?: number;
  playStatus?: PlayStatus;
} & DisplayObjectProps;

type Mutable = {
  getSpriteSheet: () => string;
  setSpriteSheet: (spriteSheet?: string) => Promise<void>;

  setAnimation: (animation: string) => void;
  setFrame: (frame: number, playStatus?: PlayStatus) => void;
  setPlayStatus: (playStatus: PlayStatus) => void;
} & DisplayObjectMutable<AnimatedSprite>;

export const animatedSprite: AsyncComponent<Props, Mutable, false> = async (
  originalProps,
) => {
  const { spriteSheet, animation, frame, playStatus } = originalProps;

  const $props = structuredClone(originalProps);

  let $spriteSheet = spriteSheet + "";
  let $currentAnimation = animation + "";
  let $frame = frame || 0;
  let $playStatus: PlayStatus = playStatus || PlayStatus.STOP;
  let $spriteSheetTexture = await PIXI.Assets.load(spriteSheet);

  const $animatedSprite = new PIXI.AnimatedSprite(
    $spriteSheetTexture.animations[$currentAnimation],
  );

  const setSpriteSheet = async (spriteSheet: string) => {
    $spriteSheet = spriteSheet + "";
    $spriteSheetTexture = await PIXI.Assets.load(spriteSheet);
    $animatedSprite.textures =
      $spriteSheetTexture.animations[$currentAnimation];
  };
  const getSpriteSheet = () => $spriteSheet;

  const setAnimation = (animation: string) => {
    if ($currentAnimation === animation) return;

    $currentAnimation = animation;
    $animatedSprite.textures =
      $spriteSheetTexture.animations[$currentAnimation];
  };

  const setFrame = (frame: number) => {
    $frame = frame;
    $playStatus === PlayStatus.PLAY
      ? $animatedSprite.gotoAndPlay(frame)
      : $animatedSprite.gotoAndStop(frame);
  };
  if ($frame !== undefined) setFrame($frame);

  const setPlayStatus = (playStatus: PlayStatus) => {
    $playStatus = playStatus;
    if (playStatus === PlayStatus.PLAY) {
      $animatedSprite.play();
      $animatedSprite.loop = true;
    }
    if (playStatus === PlayStatus.STOP) $animatedSprite.stop();
    if (playStatus === PlayStatus.PLAY_AND_STOP) {
      $animatedSprite.loop = false;
      $animatedSprite.play();
    }
  };
  if ($playStatus !== undefined) setPlayStatus($playStatus);

  const emptyMutable = empty(originalProps);
  //
  const displayObjectMutable = await initDisplayObjectMutable<AnimatedSprite>(
    $animatedSprite,
    emptyMutable,
  );
  //
  const $getRaw = (): Props => ({
    ...displayObjectMutable.$getRaw(),
    spriteSheet: $spriteSheet,
    animation: $currentAnimation,
    frame: $frame,
    playStatus: $playStatus,
  });

  const $destroy = () => {
    //remove child first
    $animatedSprite?.parent?.removeChild($animatedSprite);
    displayObjectMutable.$destroy();
    //destroy pixi graphics
    $animatedSprite.destroy();
    mutable.getFather = null;
  };

  const mutable: InternalMutable<Mutable, false> = {
    ...displayObjectMutable,

    getDisplayObject: () => $animatedSprite,

    setSpriteSheet,
    getSpriteSheet,
    setAnimation,
    setFrame,
    setPlayStatus,

    getProps: () => $props as any,

    $destroy,
    $getRaw,

    $mutable: false,
  };

  return mutable;
};
