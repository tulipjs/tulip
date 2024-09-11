import * as PIXI from "pixi.js";
import {
  NineSliceSprite,
  NineSliceSpriteMutable,
  NineSliceSpriteProps,
} from "../../types";
import { displayObject } from "./display-object.component";
import { getTexture } from "../../utils";

/**
 * A: leftWidth
 * B: topHeight
 * C: rightWidth
 * D: bottomHeight
 *
 *       A                          B
 *     +---+----------------------+---+
 *   C | 1 |          2           | 3 |
 *     +---+----------------------+---+
 *     |   |                      |   |
 *     | 4 |          5           | 6 |
 *     |   |                      |   |
 *     +---+----------------------+---+
 *   D | 7 |          8           | 9 |
 *     +---+----------------------+---+
 *   When changing this objects width and/or height:
 *      areas 1 3 7 and 9 will remain unscaled.
 *      areas 2 and 8 will be stretched horizontally
 *      areas 4 and 6 will be stretched vertically
 *      area 5 will be stretched both horizontally and vertically
 * @param originalProps
 */
export const nineSliceSprite = <Props = {}, Mutable = {}, Data = {}>(
  originalProps: NineSliceSpriteProps<Props, Data> = {} as NineSliceSpriteProps<
    Props,
    Data
  >,
): NineSliceSpriteMutable<Props, Mutable, Data> => {
  const $displayObject = displayObject<
    NineSliceSprite,
    NineSliceSpriteProps<Props>
  >({
    ...originalProps,
    displayObject: new PIXI.NineSliceSprite({
      texture: PIXI.Texture.EMPTY,
    }),
  });

  const {
    texture,
    spriteSheet,

    leftWidth,
    topHeight,
    rightWidth,
    bottomHeight,
    width,
    height,
  } = $displayObject.getProps();

  const $sprite = $displayObject.getDisplayObject({ __preventWarning: true });

  let $texture = texture;
  let $spriteSheet = spriteSheet;

  const getSpriteSheet = () => $spriteSheet;

  const setTexture = (texture?: string, spriteSheet?: string) => {
    $texture = texture;
    $spriteSheet = spriteSheet;

    $sprite.texture = getTexture(texture, spriteSheet);

    $sprite.bottomHeight = bottomHeight;
    $sprite.leftWidth = leftWidth;
    $sprite.topHeight = topHeight;
    $sprite.rightWidth = rightWidth;
    $sprite.width = width;
    $sprite.height = height;
  };

  const $$getRaw = $displayObject.$getRaw;
  const $$destroy = $displayObject.$destroy;

  const $getRaw = (): NineSliceSpriteProps => ({
    ...$$getRaw(),
    texture: $texture,
    spriteSheet: $spriteSheet,
    bottomHeight: bottomHeight,
    leftWidth: leftWidth,
    topHeight: topHeight,
    rightWidth: rightWidth,
    width: width,
    height: height,
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
  } as NineSliceSpriteMutable<Props, Mutable, Data>;

  return $displayObject.getComponent(nineSliceSprite, $mutable);
};
