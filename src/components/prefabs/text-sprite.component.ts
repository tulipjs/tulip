import {
  ContainerComponent,
  PartialTextSpriteMutable,
  PartialTextSpriteProps,
} from "../../types";
import { container } from "../core";
import * as PIXI from "pixi.js";
import { isNotNullish } from "../../utils";

export const textSprite: ContainerComponent<
  PartialTextSpriteProps,
  PartialTextSpriteMutable
> = async (props) => {
  const $containerComponent = await container<
    PartialTextSpriteProps,
    PartialTextSpriteMutable
  >(props);

  const $container = $containerComponent.getDisplayObject({
    __preventWarning: true,
  });
  //------------------------------------------------------------------
  let $currentText = "";
  let $currentColor = 0xffffff;

  const { spriteSheet, text, color } = $containerComponent.getProps();
  const { textures } = await PIXI.Assets.load(spriteSheet);

  const renderText = ({ text, color }: { text?: string; color?: number }) => {
    if (isNotNullish(text)) $currentText = text;
    if (isNotNullish(color)) $currentColor = color;

    $container.removeChildren();
    $container.tint = $currentColor;

    let nextPositionX = 0;
    for (const character of $currentText.split("")) {
      const characterSprite = new PIXI.Sprite(textures[character]);

      characterSprite.position.x = nextPositionX;
      $container.addChild(characterSprite);

      nextPositionX = $container.width + 1;
    }
  };
  renderText({ text, color });

  const setText = (text) => renderText({ text });
  const getText = () => $currentText;

  const setColor = (color: number) => renderText({ color });
  const getColor = () => $currentColor;
  //------------------------------------------------------------------

  return $containerComponent.getComponent(textSprite, {
    setText,
    getText,

    setColor,
    getColor,

    $getSize: (letter: string) =>
      textures[letter]
        ? {
            width: textures[letter].width,
            height: textures[letter].height,
          }
        : { width: 0, height: 0 },
    $getFullSize: () =>
      text.split("").reduce(
        (acc, curr) => ({
          width: acc.width + textures[curr].width + 1,
          height: Math.max(acc.height, textures[curr].height),
        }),
        { width: 0, height: 0 },
      ),
  });
};
