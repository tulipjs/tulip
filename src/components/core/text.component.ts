import * as PIXI from "pixi.js";
import {
  Point,
  Text,
  PartialTextProps,
  TextProps,
  TextMutable,
} from "../../types";
import { displayObject } from "./display-object.component";
import { isNotNullish } from "../../utils";

export const text = async <Props = {}, Mutable = {}, Data = {}>(
  originalProps: TextProps<Props, Data> = {} as TextProps<Props, Data>,
): Promise<TextMutable<Props, Mutable, Data>> => {
  const $displayObject = await displayObject<Text, TextProps<Props>>({
    ...originalProps,
    displayObject: new PIXI.Text({ text: "" }),
  });

  const { font, text: currentText, color, size } = originalProps;

  const $text = $displayObject.getDisplayObject({ __preventWarning: true });

  const setText = (_text: string) => {
    $text.text = _text;
  };

  const setSkew = (skew: Point) => {
    $text.skew.set(skew.x, skew.y);
  };

  const setColor = (color: number) => {
    $text.style.fill = color;
  };

  const setSize = (size: number) => {
    $text.style.fontSize = size;
  };

  const setFont = (font: string) => {
    $text.style.fontFamily = font;
  };

  const $$getRaw = $displayObject.$getRaw;

  const $getRaw = (): PartialTextProps => ({
    ...$$getRaw(),
    font,
    text: currentText,
    color,
    size,
  });

  const $getText = () => $text;

  {
    if (isNotNullish(currentText)) setText(currentText);
    if (isNotNullish(size)) setSize(size);
    if (isNotNullish(font)) setFont(font);
    if (isNotNullish(color)) setColor(color);
  }

  const $mutable = {
    setText,
    setSkew,
    setColor,
    setSize,
    setFont,

    $getRaw,
    $getText,
  } as TextMutable<Props, Mutable, Data>;

  return $displayObject.getComponent(text, $mutable);
};
