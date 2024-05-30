import * as PIXI from "libs/pixi.mjs";
import { AsyncComponent, Component, Sprite, Texture } from "types";
import {
  ContainerMutable,
  ContainerProps,
  getContainerMutable,
  setContainerProps,
} from "./container.component";

type Props = {
  texture: string;
} & ContainerProps;

type Mutable = {} & ContainerMutable;

export const spriteComponent: AsyncComponent<
  Sprite,
  Props,
  Mutable
> = async ({
  texture = undefined,
  ...props
}) => {
  const spriteTexture = texture
    ? await PIXI.Assets.load(texture)
    : PIXI.Texture.EMPTY;
  const sprite = new PIXI.Sprite(spriteTexture);
  setContainerProps(sprite, props);

  const mutable = {
    // container
    ...getContainerMutable(sprite),

    // graphics
    setColor: (color: number) => {
    },
    getColor: () => {
    },
  };

  return [sprite, mutable];
};
