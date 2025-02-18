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

  onTextChange?: (preText: string, postText: string) => boolean;

  selectionVisible?: boolean;
  selectionColor?: number;
  selectionGap?: number;
  selectionPadding?: number;

  autoFocus?: boolean;
} & Omit<PartialTextSpriteProps, "text">;

export type InputTextSpriteProps<Data = {}> = PartialInputTextSpriteProps &
  ContainerProps<Data>;

export type PartialInputTextSpriteMutable = {
  setEditable: (editable: boolean) => void;
  getText: () => string;
  setText: (text: string) => void;
  clear: () => void;

  setSelectionVisible: (visible: boolean) => void;
  getSelectionVisible: () => boolean;

  setSelectionColor: (color: number) => void;
  getSelectionColor: () => number;

  setSelectionGap: (gap: number) => void;
  getSelectionGap: () => number;

  setSelectionPadding: (padding: number) => void;
  getSelectionPadding: () => number;

  setCursorPosition: (pos: number) => void;
  getCursorPosition: () => number;
} & Omit<
  PartialTextSpriteMutable,
  "setText" | "getText" | "$getTextBounds" | "$getCharacter"
>;

export type InputTextSpriteMutable = PartialInputTextSpriteMutable &
  ContainerMutable;
