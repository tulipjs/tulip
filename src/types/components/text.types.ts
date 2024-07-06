import { Text } from "../pixi.types";
import { Point } from "../point.types";
import {
  AsyncDisplayObjectComponent,
  InternalDisplayObjectMutable,
  DisplayObjectMutable,
} from "../display-object.types";

export type Font = {
  alias: string;
  src: string;
};

export type PartialTextProps = {
  font?: string;
  text: string;
  color: number;
  size: number;
};

export type PartialTextMutable = {
  setText: (text: string) => void;
  setSkew: (skew: Point) => void;
  $getText: () => Text;
};

export type TextMutable = DisplayObjectMutable<Text> & PartialTextMutable;

////////////////////////////
export type InternalAsyncTextMutable<
  Props = {},
  Mutable = {},
  Data = {},
> = Promise<InternalTextMutable<Props, Mutable, Data>>;
export type InternalTextMutable<
  Props = {},
  Mutable = {},
  Data = {},
> = InternalDisplayObjectMutable<
  Text,
  PartialTextProps & Props,
  PartialTextMutable & Mutable,
  Data
>;

////////////////////////////
export type TextComponent<
  Props = {},
  Mutable = {},
  Data = {},
> = AsyncDisplayObjectComponent<
  Text,
  PartialTextProps & Props,
  PartialTextMutable & Mutable,
  Data
>;
