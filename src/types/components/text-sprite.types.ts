import {
  ContainerComponent,
  ContainerMutable,
  ContainerProps,
} from "./container.types";
import { Texture } from "pixi.js";
import { Size } from "../size.types";
import { IndividualSides } from "../sides.types";
import { HorizontalAlign, VerticalAlign } from "../../enums";

export type PartialTextSpriteProps<Props = {}> = {
  spriteSheet: string;

  text: string;
  color?: number;
  verticalAlign?: VerticalAlign;
  horizontalAlign?: HorizontalAlign;

  size?: Size;
  backgroundColor?: number;
  backgroundAlpha?: number;
  backgroundPadding?: IndividualSides;

  withMask?: boolean;
} & Props;

export type PartialTextSpriteMutable<Mutable = {}> = {
  setText: (text: string) => Promise<void>;
  getText: () => string;

  setColor: (color: number) => Promise<void>;
  getColor: () => number;

  setSize: (size: Size) => Promise<void>;
  getSize: () => Size;

  setBackgroundColor: (color: number) => Promise<void>;
  getBackgroundColor: () => number;

  setBackgroundAlpha: (alpha: number) => Promise<void>;
  getBackgroundAlpha: () => number;

  setBackgroundPadding: (padding: IndividualSides) => Promise<void>;
  getBackgroundPadding: () => IndividualSides;

  setVerticalAlign: (verticalAlign: VerticalAlign) => Promise<void>;
  getVerticalAlign: () => VerticalAlign;

  setHorizontalAlign: (horizontalAlign: HorizontalAlign) => Promise<void>;
  getHorizontalAlign: () => HorizontalAlign;

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
