import * as PIXI from "pixi.js";
import { Sprite, SpriteProps, SpriteMutable } from "../../types";
import { displayObject } from "./display-object.component";

export const sprite = async <Props = {}, Mutable = {}, Data = {}>(
  originalProps: SpriteProps<Props, Data> = {} as SpriteProps<Props, Data>,
): Promise<SpriteMutable<Props, Mutable, Data>> => {
  const $displayObject = await displayObject<Sprite, SpriteProps<Props>>({
    ...originalProps,
    displayObject: new PIXI.Sprite(),
  });

  const { texture } = $displayObject.getProps();

  const $sprite = $displayObject.getDisplayObject({ __preventWarning: true });
  let $texture = texture;

  const $getTexture = async (texture?: string) => {
    const targetTexture = texture
      ? await PIXI.Assets.load(texture)
      : PIXI.Texture.EMPTY;
    targetTexture.source.scaleMode = "nearest";

    return targetTexture;
  };

  const setTexture = async (texture?: string) => {
    $texture = texture;
    $sprite.texture = await $getTexture(texture);
  };

  const $$getRaw = $displayObject.$getRaw;
  const $$destroy = $displayObject.$destroy;

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
    $displayObject.getFather = () => null;
  };

  {
    await setTexture(texture);
  }

  const $mutable = {
    setTexture,

    $destroy,
    $getRaw,
  } as SpriteMutable<Props, Mutable, Data>;

  return $displayObject.getComponent(sprite, $mutable);
};
