import { ContainerMutable, ContainerProps } from "./container.types";
import {
  PartialTextSpriteMutable,
  PartialTextSpriteProps,
} from "./text-sprite.types";

export type PartialInputTextSpriteProps = {
  editable?: boolean;
  passwordChar?: string;
  defaultValue?: string;

  placeholder?: string;
  placeHolderAlpha?: number;

  maxLength?: number;

  onTextChange?: (
    preText: string,
    postText: string,
  ) => boolean | Promise<boolean>;
} & Omit<PartialTextSpriteProps, "text">;

export type InputTextSpriteProps<Data = {}> = PartialInputTextSpriteProps &
  ContainerProps<Data>;

export type PartialInputTextSpriteMutable = {
  setEditable: (editable: boolean) => void;
  getText: () => string;
  reset: () => void;
} & Omit<
  PartialTextSpriteMutable,
  "setText" | "getText" | "$getTextBounds" | "$getCharacter"
>;

export type InputTextSpriteMutable = PartialInputTextSpriteMutable &
  ContainerMutable;
