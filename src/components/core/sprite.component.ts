import * as PIXI from "pixi.js";
import {
  AsyncComponent,
  DisplayObjectMutable,
  DisplayObjectProps,
  InternalMutable,
  Sprite,
} from "../../types";
import { getDisplayObjectMutable, setDisplayObjectProps } from "../../utils";
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
  const { label, texture = undefined, ...props } = originalProps;

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

  const sprite = new PIXI.Sprite(spriteTexture) as Sprite;
  const emptyMutable = empty({ label });

  const displayObjectMutable = getDisplayObjectMutable<Sprite>(
    sprite,
    emptyMutable,
  );
  setDisplayObjectProps<Sprite>(sprite, props, displayObjectMutable);

  const setTexture = async (texture?: string) => {
    $texture = texture;
    sprite.texture = await $getTexture(texture);
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
  };

  const mutable: InternalMutable<Mutable, false> = {
    // container
    ...displayObjectMutable,

    // sprite
    setTexture,

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
