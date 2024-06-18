import * as PIXI from "pixi.js";
import {
  AsyncComponent,
  DisplayObjectMutable,
  DisplayObjectProps,
  InternalMutable,
  AnimatedSprite,
} from "../../types";
import { getDisplayObjectMutable, setDisplayObjectProps } from "../../utils";
import { empty } from "./empty.component";

type Props = {
  spriteSheet: string;
} & DisplayObjectProps;

type Mutable = {
  setSpriteSheet: (spriteSheet?: string) => Promise<void>;
} & DisplayObjectMutable<AnimatedSprite>;

export const animatedSprite: AsyncComponent<Props, Mutable, false> = async (
  originalProps,
) => {
  const { label, spriteSheet = undefined, ...props } = originalProps;

  const $props = structuredClone(originalProps);

  let $spriteSheet = spriteSheet;
  const spriteSheetTexture = await PIXI.Assets.load(spriteSheet);

  console.log(spriteSheetTexture);
  // const $getTexture = async (texture?: string) => {
  //   const targetTexture = texture
  //     ? await PIXI.Assets.load(texture)
  //     : PIXI.Texture.EMPTY;
  //   targetTexture.source.scaleMode = "nearest";
  //
  //   return targetTexture;
  // };

  // const sprite = new PIXI.AnimatedSprite(spriteTexture) as AnimatedSprite;
  // const emptyMutable = empty({ label });
  //
  // const displayObjectMutable = getDisplayObjectMutable<AnimatedSprite>(
  //   sprite,
  //   emptyMutable,
  // );
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
    // ...displayObjectMutable,

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
