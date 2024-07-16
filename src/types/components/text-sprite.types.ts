import {
  ContainerComponent,
  ContainerMutable,
  ContainerProps,
} from "./container.types";
import { Texture } from "pixi.js";
import { Size } from "../size.types";
import { IndividualSides } from "../sides.types";

export type PartialTextSpriteProps<Props = {}> = {
  spriteSheet: string;

  text: string;
  color?: number;

  size?: Size;
  backgroundColor?: number;
  backgroundAlpha?: number;
  backgroundPadding?: IndividualSides;
} & Props;

export type PartialTextSpriteMutable<Mutable = {}> = {
  setText: (text: string) => Promise<void>;
  getText: () => string;

  setColor: (color: number) => Promise<void>;
  getColor: () => number;

  getSize: () => Size;
  setSize: (size: Size) => Promise<void>;

  getBackgroundColor: () => number;
  setBackgroundColor: (color: number) => Promise<void>;

  getBackgroundAlpha: () => number;
  setBackgroundAlpha: (alpha: number) => Promise<void>;

  getBackgroundPadding: () => IndividualSides;
  setBackgroundPadding: (padding: IndividualSides) => Promise<void>;

  $getTextBounds: () => Size;
  $getCharacter: (character: string) => Texture;
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
