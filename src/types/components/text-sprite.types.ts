import {
  ContainerComponent,
  ContainerMutable,
  ContainerProps,
} from "./container.types";
import { Size } from "../size.types";

export type PartialTextSpriteProps<Props = {}> = {
  spriteSheet: string;

  text: string;
  color?: number;
} & Props;

export type PartialTextSpriteMutable<Mutable = {}> = {
  setText: (text: string) => void;
  getText: () => string;

  setColor: (color: number) => void;
  getColor: () => number;

  $getSize: (letter: string) => Size;
  $getFullSize: () => Size;
} & Mutable;

////////////////////////////
export type TextSpriteProps<Props = {}, Data = {}> = ContainerProps<
  PartialTextSpriteProps<Props>,
  Data
>;

export type TextSpriteMutable<
  Props = {},
  Mutable = {},
  Data = {},
> = ContainerMutable<
  TextSpriteProps<Props, Data>,
  PartialTextSpriteMutable<Mutable>,
  Data
>;

////////////////////////////
export type TextSpriteComponent<
  Props = {},
  Mutable = {},
  Data = {},
> = ContainerComponent<
  TextSpriteProps<Props, Data>,
  TextSpriteMutable<Props, Mutable, Data>,
  Data
>;
