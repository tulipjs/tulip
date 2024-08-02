import * as PIXI from "pixi.js";
import { Spritesheet } from "pixi.js";
import { Sprite, SpriteMutable, SpriteProps } from "../../types";
import { displayObject } from "./display-object.component";
import { isNotNullish } from "../../utils";
import { global } from "../../global";

export const sprite = <Props = {}, Mutable = {}, Data = {}>(
  originalProps: SpriteProps<Props, Data> = {} as SpriteProps<Props, Data>,
): SpriteMutable<Props, Mutable, Data> => {
  const $displayObject = displayObject<Sprite, SpriteProps<Props>>({
    ...originalProps,
    displayObject: new PIXI.Sprite(),
  });

  const { texture, spriteSheet } = $displayObject.getProps();

  const $sprite = $displayObject.getDisplayObject({ __preventWarning: true });

  let $texture = texture;
  let $spriteSheet = spriteSheet;
  let $spriteSheetTexture: Spritesheet;

  const setSpriteSheet = (spriteSheet: string | null) => {
    if (!isNotNullish(spriteSheet)) {
      $spriteSheet = undefined;
      $spriteSheetTexture = undefined;
      return;
    }
    $spriteSheet = spriteSheet + "";
    $spriteSheetTexture = global.spriteSheets.get(spriteSheet);
    $spriteSheetTexture.textureSource.scaleMode = global
      .getApplication()
      .getScaleMode();

    $sprite.texture = $getTexture($texture);
  };
  const getSpriteSheet = () => $spriteSheet;

  const $getTexture = (texture?: string): PIXI.Texture => {
    if (isNotNullish($spriteSheet)) {
      const $targetTexture = $spriteSheetTexture.textures[$texture];

      if (!isNotNullish($targetTexture))
        console.error(
          `SpriteSheet ${$spriteSheet} doesn't contain ${$texture} texture!`,
        );

      return $targetTexture;
    }
    const targetTexture = texture
      ? global.textures.get(texture)
      : PIXI.Texture.EMPTY;
    targetTexture.source.scaleMode = global.getApplication().getScaleMode();

    return targetTexture;
  };

  const setTexture = (texture?: string) => {
    $texture = texture;
    $sprite.texture = $getTexture(texture);
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
    if (isNotNullish(spriteSheet)) setSpriteSheet($spriteSheet);
    setTexture(texture);
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
