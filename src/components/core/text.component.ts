import * as PIXI from "pixi.js";
import { AsyncComponent, InternalMutable, Text } from "../../types";
import { initDisplayObjectMutable } from "../../utils";
import { empty } from "./empty.component";
import { TextMutable, TextProps } from "../../types/components/text.types";
import { Assets } from "pixi.js";

export const text: AsyncComponent<TextProps, TextMutable, false> = async (
  originalProps,
) => {
  const { font, text, color } = originalProps;

  const $props = structuredClone(originalProps);

  Assets.addBundle("fonts", [font]);
  await Assets.loadBundle("fonts");

  const $text = new PIXI.Text({
    text,
    style: { fontFamily: font.alias, fontSize: 40, fill: color },
  }) as Text;

  const emptyMutable = empty(originalProps);

  const displayObjectMutable = await initDisplayObjectMutable<Text>(
    $text,
    emptyMutable,
  );

  const setText = (_text: string) => {
    $text.text = _text;
  };

  const $$getRaw = displayObjectMutable.$getRaw;

  const $getRaw = (): TextProps => ({
    ...$$getRaw(),
    font,
    text,
    color,
  });

  return displayObjectMutable.getComponent<InternalMutable<TextMutable, false>>(
    text as any,
    {
      setText,

      getProps: () => $props as any,

      $getRaw,

      $mutable: false,
    },
  );
};
