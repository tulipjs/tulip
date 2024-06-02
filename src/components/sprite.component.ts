import * as PIXI from "pixi.js";
import {
  AsyncFunction,
  DisplayObjectMutable,
  DisplayObjectProps,
  Sprite,
} from "../types";
import { getDisplayObjectMutable, setDisplayObjectProps } from "../utils";
import { empty } from "./empty.component";

type Props = {
  texture: string;
} & DisplayObjectProps;

type Mutable = {
  setTexture: (texture?: string) => Promise<void>;
} & DisplayObjectMutable<Sprite>;

export const sprite: AsyncFunction<Props, Mutable> = async ({
  texture = undefined,
  label,
  ...props
}) => {
  const emptyMutable = empty({ label });

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
    ...getDisplayObjectMutable<Sprite>(sprite, emptyMutable),

    // sprite
    setTexture: async (texture?: string) => {
      sprite.texture = await _getTexture(texture);
    },
  } as Mutable;
};
