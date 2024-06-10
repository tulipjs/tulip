import * as PIXI from "pixi.js";
import {
  AsyncComponent,
  DisplayObjectMutable,
  DisplayObjectProps,
  InternalMutable,
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

export const sprite: AsyncComponent<Props, Mutable, false> = async (
  originalProps,
) => {
  const { label, texture = undefined, ...props } = originalProps;

  const $props = structuredClone(originalProps);

  let _texture = texture;
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
  const emptyMutable = empty({ label });

  const displayObjectMutable = getDisplayObjectMutable<Sprite>(
    sprite,
    emptyMutable,
  );
  setDisplayObjectProps<Sprite>(sprite, props, displayObjectMutable);

  const setTexture = async (texture?: string) => {
    _texture = texture;
    sprite.texture = await _getTexture(texture);
  };

  const $setRaw = async ({ texture, ...raw }: Props) => {
    await displayObjectMutable.$setRaw(raw);
    await setTexture(texture);
  };

  const $getRaw = async (): Promise<Props> => ({
    ...(await displayObjectMutable.$getRaw()),
    texture: _texture,
  });

  const mutable: InternalMutable<Mutable, false> = {
    // container
    ...displayObjectMutable,

    // sprite
    setTexture,

    $getRaw,
    $setRaw,

    // @ts-ignore
    getComponent: (component) => {
      mutable.$componentName = component.name;
      return mutable;
    },

    $props,
    $mutable: false,
    $destroy: () => {
      emptyMutable.$destroy();
      sprite.destroy();
    },
  };

  return mutable;
};
