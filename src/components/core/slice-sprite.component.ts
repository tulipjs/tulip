import * as PIXI from "pixi.js";
import { SliceSprite, SliceSpriteMutable, SliceSpriteProps } from "../../types";
import { displayObject } from "./display-object.component";
import { global } from "../../global";

export const sliceSprite = <Props = {}, Mutable = {}, Data = {}>(
  originalProps: SliceSpriteProps<Props, Data> = {} as SliceSpriteProps<
    Props,
    Data
  >,
): SliceSpriteMutable<Props, Mutable, Data> => {
  const $displayObject = displayObject<SliceSprite, SliceSpriteProps<Props>>({
    ...originalProps,
    displayObject: new PIXI.NineSliceSprite({
      texture: PIXI.Texture.EMPTY,
    }),
  });

  const {
    texture,
    leftWidth,
    topHeight,
    rightWidth,
    bottomHeight,
    width,
    height,
  } = $displayObject.getProps();

  const $sprite = $displayObject.getDisplayObject({ __preventWarning: true });

  let $texture = texture;

  const $getTexture = (texture?: string): PIXI.Texture => {
    const targetTexture = texture
      ? global.textures.get(texture)
      : PIXI.Texture.EMPTY;
    targetTexture.source.scaleMode = global.getApplication().getScaleMode();

    return targetTexture;
  };

  const setTexture = (texture?: string) => {
    $texture = texture;
    // @ts-ignore
    $sprite.texture = $getTexture(texture);

    $sprite.bottomHeight = bottomHeight;
    $sprite.leftWidth = leftWidth;
    $sprite.topHeight = topHeight;
    $sprite.rightWidth = rightWidth;
    $sprite.width = width;
    $sprite.height = height;
  };

  const $$getRaw = $displayObject.$getRaw;
  const $$destroy = $displayObject.$destroy;

  const $getRaw = (): SliceSpriteProps => ({
    ...$$getRaw(),
    texture: $texture,
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
    $displayObject.getFather = () => null;
  };

  {
    setTexture(texture);
  }

  const $mutable = {
    setTexture,

    $destroy,
    $getRaw,
  } as SliceSpriteMutable<Props, Mutable, Data>;

  return $displayObject.getComponent(sliceSprite, $mutable);
};
