import * as PIXI from "pixi.js";
import { Spritesheet } from "pixi.js";
import { isNotNullish } from "./nullish.utils";
import { global } from "../global";

export const loadTexture = async (texture: string): Promise<PIXI.Texture> => {
  const data = await fetch(texture);
  const blob = await data.blob();
  const imageBitmap = await createImageBitmap(blob);
  return PIXI.Texture.from(imageBitmap);
};

export const getTexture = (
  texture?: string,
  spriteSheet?: string,
): PIXI.Texture => {
  let $texture = texture;
  let $spriteSheet = spriteSheet;
  let $spriteSheetTexture: Spritesheet;

  let $targetTexture: PIXI.Texture;

  const $setSpriteSheet = (spriteSheet: string | null) => {
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
  };

  $setSpriteSheet(spriteSheet);
  if (isNotNullish(spriteSheet)) {
    $targetTexture = $spriteSheetTexture.textures[$texture];

    if (!isNotNullish($targetTexture))
      console.error(
        `SpriteSheet ${$spriteSheet} doesn't contain ${$texture} texture!`,
      );
    return $targetTexture;
  }
  $targetTexture = texture ? global.textures.get(texture) : PIXI.Texture.EMPTY;
  $targetTexture.source.scaleMode = global.getApplication().getScaleMode();

  return $targetTexture;
};
