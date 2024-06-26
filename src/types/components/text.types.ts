import { ContainerProps } from "./container.types";
import { DisplayObjectMutable } from "../display-object.types";
import { Text } from "../pixi.types";

type Font = {
  alias: string;
  src: string;
};

export type TextProps = {
  font: Font;
  text: string;
  color: number;
} & ContainerProps;

export type TextMutable = {
  setText: (text: string) => void;
} & DisplayObjectMutable<Text>;
