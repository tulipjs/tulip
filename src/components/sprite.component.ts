import * as PIXI from "pixi.js";
import {
  AsyncComponent,
  DisplayObjectMutable,
  DisplayObjectProps,
  Sprite,
} from "../types";
import { getDisplayObjectMutable, setDisplayObjectProps } from "../utils";

type Props = {
  texture: string;
} & DisplayObjectProps;

type Mutable = {
  setTexture: (texture?: string) => Promise<void>;
} & DisplayObjectMutable<Sprite>;

export const spriteComponent: AsyncComponent<Props, Mutable> = async ({
  texture = undefined,
  ...props
}) => {
  const spriteTexture = texture
    ? await PIXI.Assets.load(texture)
    : PIXI.Texture.EMPTY;

  const _getTexture = async (texture?: string) => {
    const targetTexture = texture
      ? await PIXI.Assets.load(texture)
      : PIXI.Texture.EMPTY;
    targetTexture.source.scaleMode = "nearest";

    return targetTexture;
  };

  const sprite = new PIXI.Sprite(spriteTexture) as Sprite;
  setDisplayObjectProps<Sprite>(sprite, props);

  return {
    // container
    ...getDisplayObjectMutable<Sprite>(sprite),

    // sprite
    setTexture: async (texture?: string) => {
      sprite.texture = await _getTexture(texture);
    },
  } as Mutable;
};
