import { ContainerProps } from "./container.types";
import { DisplayObjectMutable } from "../display-object.types";
import { Text } from "../pixi.types";
import { Point } from "../point.types";

export type Font = {
  alias: string;
  src: string;
};

export type TextProps = {
  font?: string;
  text: string;
  color: number;
  size: number;
} & ContainerProps;

export type TextMutable = {
  setText: (text: string) => void;
  setSkew: (skew: Point) => void;
  $getText: () => Text;
} & DisplayObjectMutable<Text>;
