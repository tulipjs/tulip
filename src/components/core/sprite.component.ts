import * as PIXI from "pixi.js";
import {
  AsyncComponent,
  InternalMutable,
  Sprite,
  SpriteMutable,
  SpriteProps,
} from "../../types";
import { initDisplayObjectMutable } from "../../utils";
import { empty } from "./empty.component";

export const sprite: AsyncComponent<SpriteProps, SpriteMutable, false> = async (
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

  const $$getRaw = displayObjectMutable.$getRaw;
  const $$destroy = displayObjectMutable.$destroy;

  const $getRaw = (): SpriteProps => ({
    ...$$getRaw(),
    texture: $texture,
  });

  const $destroy = () => {
    //remove child first
    $sprite?.parent?.removeChild($sprite);
    $$destroy();
    //destroy pixi graphics
    $sprite.destroy();
    displayObjectMutable.getFather = () => null;
  };

  return displayObjectMutable.getComponent<
    InternalMutable<SpriteMutable, false>
  >(sprite as any, {
    getDisplayObject: () => $sprite,

    // sprite
    setTexture,

    getProps: () => $props as any,

    $destroy,
    $getRaw,

    $mutable: false,
  });
};
