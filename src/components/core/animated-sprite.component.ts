import * as PIXI from "pixi.js";
import {
  AnimatedSprite,
  AnimatedSpriteMutable,
  AnimatedSpriteProps,
  AsyncComponent,
  InternalMutable,
} from "../../types";
import { empty } from "./empty.component";
import { initDisplayObjectMutable } from "../../utils";
import { PlayStatus } from "../../enums";

export const animatedSprite: AsyncComponent<
  AnimatedSpriteProps,
  AnimatedSpriteMutable,
  false
> = async (originalProps) => {
  const { spriteSheet, animation, frame, playStatus } = originalProps;

  const $props = structuredClone(originalProps);

  let $spriteSheet = spriteSheet + "";
  let $currentAnimation = animation + "";
  let $frame = frame || 0;
  let $playStatus: PlayStatus =
    playStatus === undefined ? playStatus : PlayStatus.STOP;
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
  const getAnimation = () => $currentAnimation;

  const setFrame = (frame: number) => {
    $frame = frame;
    $playStatus === PlayStatus.PLAY
      ? $animatedSprite.gotoAndPlay(frame)
      : $animatedSprite.gotoAndStop(frame);
    //TODO What happens with PLAY_AND_STOP ???
  };
  const getFrame = () => $frame;

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
  const getPlayStatus = () => $playStatus;

  const emptyMutable = empty(originalProps);
  //
  const displayObjectMutable = await initDisplayObjectMutable<AnimatedSprite>(
    $animatedSprite,
    emptyMutable,
  );

  const $$getRaw = displayObjectMutable.$getRaw;
  const $$destroy = displayObjectMutable.$destroy;

  const $getRaw = (): AnimatedSpriteProps => ({
    ...$$getRaw(),
    spriteSheet: $spriteSheet,
    animation: $currentAnimation,
    frame: $frame,
    playStatus: $playStatus,
  });

  const $destroy = () => {
    //remove child first
    $animatedSprite?.parent?.removeChild($animatedSprite);
    $$destroy();
    //destroy pixi graphics
    $animatedSprite.destroy();

    displayObjectMutable.getFather = () => null;
  };
  {
    if ($frame !== undefined) setFrame($frame);
    if ($playStatus !== undefined) setPlayStatus($playStatus);
  }

  return displayObjectMutable.getComponent<
    InternalMutable<AnimatedSpriteMutable, false>
  >(animatedSprite as any, {
    setSpriteSheet,
    getSpriteSheet,

    setAnimation,
    getAnimation,

    setFrame,
    getFrame,

    setPlayStatus,
    getPlayStatus,

    getProps: () => $props as any,

    $destroy,
    $getRaw,

    $mutable: false,
  });
};
