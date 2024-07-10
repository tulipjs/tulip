import * as PIXI from "pixi.js";
import {
  AnimatedSprite,
  AnimatedSpriteMutable,
  AnimatedSpriteProps,
} from "../../types";
import { PlayStatus } from "../../enums";
import { displayObject } from "./display-object.component";
import { isNotNullish } from "../../utils";

export const animatedSprite = async <Props = {}, Mutable = {}, Data = {}>(
  originalProps: AnimatedSpriteProps<Props, Data> = {} as AnimatedSpriteProps<
    Props,
    Data
  >,
): Promise<AnimatedSpriteMutable<Props, Mutable, Data>> => {
  const $displayObject = await displayObject<
    AnimatedSprite,
    AnimatedSpriteProps<Props>
  >({
    ...originalProps,
    displayObject: new PIXI.AnimatedSprite([PIXI.Texture.EMPTY]),
  });

  const { spriteSheet, animation, frame, playStatus } =
    $displayObject.getProps();

  let $spriteSheet = spriteSheet + "";
  let $currentAnimation = "";
  let $frame = frame || 0;
  let $playStatus: PlayStatus =
    playStatus === undefined ? playStatus : PlayStatus.STOP;
  let $spriteSheetTexture = await PIXI.Assets.load(spriteSheet);

  const $animatedSprite = $displayObject.getDisplayObject({
    __preventWarning: true,
  });

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

  const $$getRaw = $displayObject.$getRaw;
  const $$destroy = $displayObject.$destroy;

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

    $displayObject.getFather = () => null;
  };
  {
    if (isNotNullish(animation)) setAnimation(animation);
    if (isNotNullish($frame)) setFrame($frame);
    if (isNotNullish($playStatus)) setPlayStatus($playStatus);
  }

  const $mutable = {
    setSpriteSheet,
    getSpriteSheet,

    setAnimation,
    getAnimation,

    setFrame,
    getFrame,

    setPlayStatus,
    getPlayStatus,

    $getRaw,
    $destroy,
  } as AnimatedSpriteMutable<Props, Mutable, Data>;

  return $displayObject.getComponent(animatedSprite, $mutable);
};
