import * as PIXI from "pixi.js";
import { Sprite, SpriteProps, SpriteMutable } from "../../types";
import { displayObject } from "./display-object.component";
import { isNotNullish } from "../../utils";
import { Spritesheet } from "pixi.js";
import { global } from "../../global";

export const sprite = async <Props = {}, Mutable = {}, Data = {}>(
  originalProps: SpriteProps<Props, Data> = {} as SpriteProps<Props, Data>,
): Promise<SpriteMutable<Props, Mutable, Data>> => {
  const $displayObject = await displayObject<Sprite, SpriteProps<Props>>({
    ...originalProps,
    displayObject: new PIXI.Sprite(),
  });

  const { texture, spriteSheet } = $displayObject.getProps();

  const $sprite = $displayObject.getDisplayObject({ __preventWarning: true });

  let $texture = texture;
  let $spriteSheet = spriteSheet;
  let $spriteSheetTexture: Spritesheet;

  const setSpriteSheet = async (spriteSheet: string) => {
    $spriteSheet = spriteSheet + "";
    $spriteSheetTexture = await PIXI.Assets.load(spriteSheet);
    $spriteSheetTexture.textureSource.scaleMode = global
      .getApplication()
      .getScaleMode();

    $sprite.texture = await $getTexture($texture);
  };
  const getSpriteSheet = () => $spriteSheet;

  const $getTexture = async (texture?: string): Promise<PIXI.Texture> => {
    if (isNotNullish($spriteSheet)) {
      const $targetTexture = $spriteSheetTexture.textures[$texture];

      if (!isNotNullish($targetTexture))
        console.error(
          `SpriteSheet ${$spriteSheet} doesn't contain ${$texture} texture!`,
        );

      return $targetTexture;
    }
    const targetTexture = texture
      ? await PIXI.Assets.load(texture)
      : PIXI.Texture.EMPTY;
    targetTexture.source.scaleMode = global.getApplication().getScaleMode();

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
    if (isNotNullish(spriteSheet)) await setSpriteSheet($spriteSheet);
    await setTexture(texture);
  }

  const $mutable = {
    setTexture,

    setSpriteSheet,
    getSpriteSheet,

    $destroy,
    $getRaw,
  } as SpriteMutable<Props, Mutable, Data>;

  return $displayObject.getComponent(sprite, $mutable);
};
