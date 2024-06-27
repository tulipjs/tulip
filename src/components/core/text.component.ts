import * as PIXI from "pixi.js";
import {
  AsyncComponent,
  InternalMutable,
  Point,
  Text,
  TextMutable,
  TextProps,
} from "../../types";
import { initDisplayObjectMutable } from "../../utils";
import { empty } from "./empty.component";

export const text: AsyncComponent<TextProps, TextMutable, false> = async (
  originalProps,
) => {
  const { font, text, color, size } = originalProps;

  const $props = structuredClone(originalProps);

  const $text = new PIXI.Text({
    text,
    style: { fontFamily: font, fontSize: size, fill: color },
  }) as Text;

  const emptyMutable = empty(originalProps);

  const displayObjectMutable = await initDisplayObjectMutable<Text>(
    $text,
    emptyMutable,
  );

  const setText = (_text: string) => {
    $text.text = _text;
  };

  const setSkew = (skew: Point) => {
    $text.skew.set(skew.x, skew.y);
  };

  const $$getRaw = displayObjectMutable.$getRaw;

  const $getRaw = (): TextProps => ({
    ...$$getRaw(),
    font,
    text,
    color,
    size,
  });

  const $getText = () => $text;

  return displayObjectMutable.getComponent<InternalMutable<TextMutable, false>>(
    text as any,
    {
      setText,
      setSkew,

      getProps: () => $props as any,

      $getRaw,
      $getText,

      $mutable: false,
    },
  );
};
