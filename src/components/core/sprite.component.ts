import * as PIXI from "pixi.js";
import { Sprite, SpriteMutable, SpriteProps } from "../../types";
import { displayObject } from "./display-object.component";
import { getTexture } from "../../utils";

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

  const getSpriteSheet = () => $spriteSheet;

  const setTexture = (texture?: string, spriteSheet?: string) => {
    $texture = texture;
    $spriteSheet = spriteSheet;

    $sprite.texture = getTexture(texture, spriteSheet);
  };

  const $$getRaw = $displayObject.$getRaw;
  const $$destroy = $displayObject.$destroy;

  const $getRaw = (): SpriteProps => ({
    ...$$getRaw(),
    texture: $texture,
    spriteSheet: $spriteSheet,
  });

  const $destroy = () => {
    //remove child first
    $sprite?.parent?.removeChild($sprite);
    $$destroy();
    //destroy pixi graphics
    $sprite.destroy();
    $displayObject.$setFatherId(null);
  };

  {
    setTexture(texture, spriteSheet);
  }

  const $mutable = {
    setTexture,

    getSpriteSheet,

    $destroy,
    $getRaw,
  } as SpriteMutable<Props, Mutable, Data>;

  return $displayObject.getComponent(sprite, $mutable);
};
