import { ContainerMutable, ContainerProps } from "./container.types";

export type PartialTextSpriteProps = {
  spriteSheet: string;

  text: string;
  color?: number;
};

export type TextSpriteProps<Data = {}> = PartialTextSpriteProps &
  ContainerProps<Data>;

export type PartialTextSpriteMutable = {
  setText: (text: string) => void;
  getText: () => string;

  setColor: (color: number) => void;
  getColor: () => number;
};

export type TextSpriteMutable = PartialTextSpriteMutable & ContainerMutable;
