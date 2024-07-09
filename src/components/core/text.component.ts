import * as PIXI from "pixi.js";
import {
  InternalAsyncTextMutable,
  InternalTextMutable,
  Point,
  Text,
  PartialTextMutable,
  PartialTextProps,
  TextProps,
} from "../../types";
import { initDisplayObjectMutable } from "../../utils";
import { empty } from "./empty.component";

export const text = async <Props, Mutable, Data>(
  originalProps = {} as TextProps<Data> & Props,
): InternalAsyncTextMutable<Props, Mutable, Data> => {
  const { font, text: currentText, color, size } = originalProps;

  const $props = structuredClone(originalProps);

  const $text = new PIXI.Text({
    text: currentText,
    style: { fontFamily: font, fontSize: size, fill: color },
  }) as Text;

  const emptyMutable = empty(originalProps);

  const displayObjectMutable = await initDisplayObjectMutable<Text>(
    $text,
    //@ts-ignore
    emptyMutable,
  );

  const setText = (_text: string) => {
    $text.text = _text;
  };

  const setSkew = (skew: Point) => {
    $text.skew.set(skew.x, skew.y);
  };

  const setColor = (color: number) => {
    $text.style.fill = color;
  };

  const $$getRaw = displayObjectMutable.$getRaw;

  const $getRaw = (): PartialTextProps => ({
    ...$$getRaw(),
    font,
    text: currentText,
    color,
    size,
  });

  const $getText = () => $text;

  const $mutable: Partial<InternalTextMutable<Props, unknown, Data>> &
    PartialTextMutable = {
    setText,
    setSkew,
    setColor,

    getProps: () => $props as any,

    //@ts-ignore
    $getRaw,
    $getText,

    $mutable: false,
  };

  return displayObjectMutable.getComponent(
    text,
    $mutable as InternalTextMutable<Props, Mutable, Data>,
  );
};
