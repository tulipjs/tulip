import { Text } from "../pixi.types";
import { Point } from "../point.types";
import {
  DisplayObjectComponent,
  DisplayObjectMutable,
  DisplayObjectProps,
} from "./display-object.types";

export type Font = {
  alias: string;
  src: string;
};

export type PartialTextProps<Props = {}> = {
  font?: string;
  text: string;
  color: number;
  size: number;
} & Props;

export type PartialTextMutable<Mutable = {}> = {
  setText: (text: string) => void;
  setSkew: (skew: Point) => void;
  setColor: (color: number) => void;
  setFont: (font: string) => void;
  setSize: (size: number) => void;
  $getText: () => Text;
} & Mutable;

////////////////////////////
export type TextProps<Props = {}, Data = {}> = DisplayObjectProps<
  PartialTextProps<Props>,
  Data
>;

export type TextMutable<
  Props = {},
  Mutable = {},
  Data = {},
> = DisplayObjectMutable<
  Text,
  TextProps<Props, Data>,
  PartialTextMutable<Mutable>,
  Data
>;

////////////////////////////
export type TextComponent<
  Props = {},
  Mutable = {},
  Data = {},
> = DisplayObjectComponent<
  Text,
  TextProps<Props, Data>,
  TextMutable<Props, Mutable, Data>,
  Data
>;
