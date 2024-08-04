import {
  ContainerComponent,
  ContainerMutable,
  ContainerProps,
} from "./container.types";
import { Texture } from "pixi.js";
import { Size } from "../size.types";
import { IndividualSides } from "../sides.types";
import { HorizontalAlign, VerticalAlign } from "../../enums";
import { Container } from "../pixi.types";

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

  accentYCorrection?: number;

  withMask?: boolean;
} & Props;

export type PartialTextSpriteMutable<Mutable = {}> = {
  setText: (text: string) => void;
  getText: () => string;

  setColor: (color: number) => void;
  getColor: () => number;

  setSize: (size: Size) => void;
  getSize: () => Size;

  setBackgroundColor: (color: number) => void;
  getBackgroundColor: () => number;

  setBackgroundAlpha: (alpha: number) => void;
  getBackgroundAlpha: () => number;

  setBackgroundPadding: (padding: IndividualSides) => void;
  getBackgroundPadding: () => IndividualSides;

  setVerticalAlign: (verticalAlign: VerticalAlign) => void;
  getVerticalAlign: () => VerticalAlign;

  setHorizontalAlign: (horizontalAlign: HorizontalAlign) => void;
  getHorizontalAlign: () => HorizontalAlign;

  $render: () => void;
  $getTextBounds: () => Size;
  $getCharacter: (character: string) => Texture;
  $getTextContainer: () => Container;
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
