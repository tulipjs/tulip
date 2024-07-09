import * as PIXI from "pixi.js";
import {
  InternalAsyncSpriteMutable,
  InternalSpriteMutable,
  Sprite,
  PartialSpriteMutable,
  PartialSpriteProps,
  SpriteProps,
} from "../../types";
import { initDisplayObjectMutable } from "../../utils";
import { empty } from "./empty.component";

export const sprite = async <Props, Mutable, Data>(
  originalProps = {} as SpriteProps<Data> & Props,
): InternalAsyncSpriteMutable<Props, Mutable, Data> => {
  const { texture = undefined } = originalProps;

  const $props = structuredClone(originalProps);

  let $texture = texture;

  const $getTexture = async (texture?: string) => {
    const targetTexture = texture
      ? await PIXI.Assets.load(texture)
      : PIXI.Texture.EMPTY;
    targetTexture.source.scaleMode = "nearest";

    return targetTexture;
  };
  const spriteTexture = await $getTexture(texture);

  const $sprite = new PIXI.Sprite(spriteTexture) as Sprite;
  const emptyMutable = empty<Props, Mutable, Data>(originalProps);

  const displayObjectMutable = await initDisplayObjectMutable<Sprite>(
    $sprite,
    //@ts-ignore
    emptyMutable,
  );

  const setTexture = async (texture?: string) => {
    $texture = texture;
    $sprite.texture = await $getTexture(texture);
  };

  const $$getRaw = displayObjectMutable.$getRaw;
  const $$destroy = displayObjectMutable.$destroy;

  const $getRaw = (): PartialSpriteProps => ({
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

  const $mutable: Partial<InternalSpriteMutable<Props, unknown, Data>> &
    PartialSpriteMutable = {
    // sprite
    setTexture,

    getProps: () => $props as any,

    $destroy,
    //@ts-ignore
    $getRaw,

    $mutable: false,
  };

  return displayObjectMutable.getComponent(
    sprite,
    $mutable as InternalSpriteMutable<Props, Mutable, Data>,
  );
};
