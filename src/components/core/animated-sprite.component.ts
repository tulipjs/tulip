import * as PIXI from "pixi.js";
import {
  AsyncComponent,
  DisplayObjectMutable,
  DisplayObjectProps,
  InternalMutable,
  AnimatedSprite,
} from "../../types";
import { empty } from "./empty.component";
import { getDisplayObjectMutable } from "../../utils";

type Props = {
  spriteSheet: string;
  animation: string;
} & DisplayObjectProps;

type Mutable = {
  setSpriteSheet: (spriteSheet?: string) => Promise<void>;

  setAnimation: (animation: string) => void;
} & DisplayObjectMutable<AnimatedSprite>;

export const animatedSprite: AsyncComponent<Props, Mutable, false> = async (
  originalProps,
) => {
  const { label, spriteSheet, animation, ...props } = originalProps;

  const $props = structuredClone(originalProps);

  let $spriteSheet = spriteSheet + "";
  const spriteSheetTexture = await PIXI.Assets.load(spriteSheet);

  let $currentAnimation = animation + "";

  const $animatedSprite = new PIXI.AnimatedSprite(
    spriteSheetTexture.animations[$currentAnimation],
  );
  $animatedSprite.play();
  $animatedSprite.loop = true;

  const getSpriteSheet = () => $spriteSheet;

  const setAnimation = (animation: string) => {
    if ($currentAnimation === animation) return;

    $currentAnimation = animation;
    $animatedSprite.textures = spriteSheetTexture.animations[$currentAnimation];
    $animatedSprite.play();
  };

  // const $getTexture = async (texture?: string) => {
  //   const targetTexture = texture
  //     ? await PIXI.Assets.load(texture)
  //     : PIXI.Texture.EMPTY;
  //   targetTexture.source.scaleMode = "nearest";
  //
  //   return targetTexture;
  // };

  // const sprite = new PIXI.AnimatedSprite(spriteTexture) as AnimatedSprite;
  const emptyMutable = empty({ label });
  //
  const displayObjectMutable = getDisplayObjectMutable<AnimatedSprite>(
    $animatedSprite,
    emptyMutable,
  );
  // setDisplayObjectProps<AnimatedSprite>(sprite, props, displayObjectMutable);
  //
  // const $getRaw = (): Props => ({
  //   ...displayObjectMutable.$getRaw(),
  //   spriteSheet: $spriteSheet,
  // });
  //
  // const $destroy = () => {
  //   //remove child first
  //   spriteTexture?.parent?.removeChild(spriteTexture);
  //   displayObjectMutable.$destroy();
  //   //destroy pixi graphics
  //   spriteTexture.destroy();
  // };

  const mutable: InternalMutable<Mutable, false> = {
    // container
    ...displayObjectMutable,

    getDisplayObject: () => $animatedSprite,

    getSpriteSheet,
    setAnimation,

    // @ts-ignore
    getComponent: (component) => {
      mutable.$componentName = component.name;
      return mutable;
    },

    getProps: () => $props as any,

    // $destroy,
    // $getRaw,

    $mutable: false,
  };

  return mutable;
};
