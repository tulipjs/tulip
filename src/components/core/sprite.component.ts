import * as PIXI from "pixi.js";
import {
  AsyncComponent,
  DisplayObjectMutable,
  DisplayObjectProps,
  InternalMutable,
  Sprite,
} from "../../types";
import { initDisplayObjectMutable } from "../../utils";
import { empty } from "./empty.component";

type Props = {
  texture: string;
} & DisplayObjectProps;

type Mutable = {
  setTexture: (texture?: string) => Promise<void>;
} & DisplayObjectMutable<Sprite>;

export const sprite: AsyncComponent<Props, Mutable, false> = async (
  originalProps,
) => {
  const { texture = undefined } = originalProps;

  const $props = structuredClone(originalProps);

  let $texture = texture;
  const spriteTexture = texture
    ? await PIXI.Assets.load(texture)
    : PIXI.Texture.EMPTY;

  const $getTexture = async (texture?: string) => {
    const targetTexture = texture
      ? await PIXI.Assets.load(texture)
      : PIXI.Texture.EMPTY;
    targetTexture.source.scaleMode = "nearest";

    return targetTexture;
  };

  const $sprite = new PIXI.Sprite(spriteTexture) as Sprite;
  const emptyMutable = empty(originalProps);

  const displayObjectMutable = await initDisplayObjectMutable<Sprite>(
    $sprite,
    emptyMutable,
  );

  const setTexture = async (texture?: string) => {
    $texture = texture;
    $sprite.texture = await $getTexture(texture);
  };

  const $getRaw = (): Props => ({
    ...displayObjectMutable.$getRaw(),
    texture: $texture,
  });

  const $destroy = () => {
    //remove child first
    spriteTexture?.parent?.removeChild(spriteTexture);
    displayObjectMutable.$destroy();
    //destroy pixi graphics
    spriteTexture.destroy();
    mutable.getFather = null;
  };

  const mutable: InternalMutable<Mutable, false> = {
    // container
    ...displayObjectMutable,

    // sprite
    setTexture,

    getProps: () => $props as any,

    $destroy,
    $getRaw,

    $mutable: false,
  };

  return mutable;
};
