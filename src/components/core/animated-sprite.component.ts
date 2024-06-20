import * as PIXI from "pixi.js";
import {
  AnimatedSprite,
  AsyncComponent,
  DisplayObjectMutable,
  DisplayObjectProps,
  InternalMutable,
} from "../../types";
import { empty } from "./empty.component";
import { getDisplayObjectMutable, setDisplayObjectProps } from "../../utils";
import { PlayStatus } from "../../enums";

type Props = {
  spriteSheet: string;
  animation: string;
  frame?: number;
  playStatus?: PlayStatus;
} & DisplayObjectProps;

type Mutable = {
  setSpriteSheet: (spriteSheet?: string) => Promise<void>;

  setAnimation: (animation: string) => void;
  setFrame: (frame: number, playStatus?: PlayStatus) => void;
  setPlayStatus: (playStatus: PlayStatus) => void;
} & DisplayObjectMutable<AnimatedSprite>;

export const animatedSprite: AsyncComponent<Props, Mutable, false> = async (
  originalProps,
) => {
  const { label, spriteSheet, animation, frame, playStatus, ...props } =
    originalProps;

  const $props = structuredClone(originalProps);

  let $spriteSheet = spriteSheet + "";
  let $currentAnimation = animation + "";
  let $frame = frame || 0;
  let $playStatus: PlayStatus = playStatus || PlayStatus.STOP;

  const spriteSheetTexture = await PIXI.Assets.load(spriteSheet);

  const $animatedSprite = new PIXI.AnimatedSprite(
    spriteSheetTexture.animations[$currentAnimation],
  );

  const getSpriteSheet = () => $spriteSheet;

  const setAnimation = (animation: string) => {
    if ($currentAnimation === animation) return;

    $currentAnimation = animation;
    $animatedSprite.textures = spriteSheetTexture.animations[$currentAnimation];
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

  const emptyMutable = empty({ label });
  //
  const displayObjectMutable = getDisplayObjectMutable<AnimatedSprite>(
    $animatedSprite,
    emptyMutable,
  );
  setDisplayObjectProps<AnimatedSprite>(
    $animatedSprite,
    props,
    displayObjectMutable,
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
  };

  const mutable: InternalMutable<Mutable, false> = {
    // container
    ...displayObjectMutable,

    getDisplayObject: () => $animatedSprite,

    getSpriteSheet,
    setAnimation,
    setFrame,
    setPlayStatus,

    // @ts-ignore
    getComponent: (component) => {
      mutable.$componentName = component.name;
      return mutable;
    },

    getProps: () => $props as any,

    $destroy,
    $getRaw,

    $mutable: false,
  };

  return mutable;
};
