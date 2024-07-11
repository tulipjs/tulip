import { ContainerMutable, ContainerProps } from "./container.types";

export type PartialInputTextSpriteProps = {
  spriteSheet: string;
  color?: number;
  editable?: boolean;
};

export type InputTextSpriteProps<Data = {}> = PartialInputTextSpriteProps &
  ContainerProps<Data>;

export type PartialInputTextSpriteMutable = {
  setEditable: (editable: boolean) => void;
  getText: () => string;
  reset: () => void;
};

export type InputTextSpriteMutable = PartialInputTextSpriteMutable &
  ContainerMutable;
