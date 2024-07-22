import {
  ContainerComponent,
  IndividualSides,
  PartialTextSpriteMutable,
  PartialTextSpriteProps,
} from "../../types";
import { container, graphics } from "../core";
import * as PIXI from "pixi.js";
import { Size, Texture } from "pixi.js";
import { isNotNullish } from "../../utils";
import {
  EventMode,
  GraphicType,
  HorizontalAlign,
  VerticalAlign,
} from "../../enums";

export const textSprite: ContainerComponent<
  PartialTextSpriteProps,
  PartialTextSpriteMutable
> = async (props) => {
  const $containerComponent = await container<
    PartialTextSpriteProps,
    PartialTextSpriteMutable
  >(props);

  const {
    spriteSheet,
    text,
    color,
    size,
    backgroundAlpha,
    backgroundColor,
    backgroundPadding,
    cursor,
    verticalAlign,
    horizontalAlign,
    withMask = false,
  } = $containerComponent.getProps();

  let $currentText = text;
  let $currentColor = color;
  let $size = {
    width: size?.width,
    height: size?.height,
  };
  let $backgroundAlpha = backgroundAlpha || 0;
  let $backgroundColor = backgroundColor ?? 0xffffff;
  let $backgroundPadding = backgroundPadding || {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };
  let $verticalAlign = verticalAlign || VerticalAlign.TOP;
  let $horizontalAlign = horizontalAlign || HorizontalAlign.LEFT;

  const { textures } = await PIXI.Assets.load(spriteSheet);

  if (!isNotNullish($size.height))
    $size.height = (Object.values(textures)[0] as Texture)?.height || 0;

  const $boxSize = {
    width: $size?.width + $backgroundPadding.left + $backgroundPadding.right,
    height: $size?.height + $backgroundPadding.top + $backgroundPadding.bottom,
  };

  const $background = await graphics({
    type: GraphicType.RECTANGLE,
    width: $boxSize.width,
    height: $boxSize.height,
    color: $backgroundColor,
    alpha: $backgroundAlpha,
    pivot: {
      x: $backgroundPadding.left,
      y: $backgroundPadding.top,
    },
    eventMode: EventMode.STATIC,
    cursor,
  });

  const $mask = await graphics({
    type: GraphicType.RECTANGLE,
    width: $boxSize.width,
    height: $boxSize.height,
    color: 0,
    pivot: {
      x: $backgroundPadding.left,
      y: $backgroundPadding.top,
    },
  });

  const $textContainerComponent = await container({
    eventMode: EventMode.NONE,
  });
  $containerComponent.add($background, $textContainerComponent);
  withMask && $containerComponent.setMask($mask);

  const $textContainer = $textContainerComponent.getDisplayObject({
    __preventWarning: true,
  });

  const renderBackground = async () => {
    let targetSize = {
      width: $size?.width || 0,
      height: $size?.height || 0,
    };

    if (!isNotNullish($size.width)) {
      // Somehow when no children, still retrieves the last size
      targetSize.width = $currentText ? $textContainer.width : 0;
    }

    $background.setRectangle(
      targetSize?.width + $backgroundPadding.left + $backgroundPadding.right,
      targetSize?.height + $backgroundPadding.top + $backgroundPadding.bottom,
    );
    await $background.setPivot({
      x: $backgroundPadding.left,
      y: $backgroundPadding.top,
    });
    $background.setColor($backgroundColor);
    await $background.setAlpha($backgroundAlpha);
  };

  const renderText = async () => {
    $textContainer.removeChildren();
    $textContainer.tint = $currentColor;

    let nextPositionX = 0;
    for (const character of $currentText.split("")) {
      const $charTexture = textures[character];
      if (!$charTexture) continue;

      const characterSprite = new PIXI.Sprite($charTexture);

      characterSprite.position.x = nextPositionX;
      $textContainer.addChild(characterSprite);

      nextPositionX = $textContainer.width + 1;
    }

    if (isNotNullish($size.width)) {
      let targetXPosition = 0;
      switch ($horizontalAlign) {
        case HorizontalAlign.CENTER:
          const midWidthSize = $size.width / 2;
          const midTextWidthSize = $textContainer.width / 2;
          targetXPosition = midWidthSize - midTextWidthSize;

          break;
        case HorizontalAlign.RIGHT:
          const farWidthSize = $size.width;
          const farTextWidthSize = $textContainer.width;
          targetXPosition = farWidthSize - farTextWidthSize;
          break;
      }
      await $textContainerComponent.setPositionX(targetXPosition);
    }

    await renderBackground();
  };

  const setText = async (text: string) => {
    if (isNotNullish(text)) $currentText = text;
    await renderText();
  };
  const getText = () => $currentText;

  const setColor = async (color: number) => {
    if (isNotNullish(color)) $currentColor = color;
    await renderText();
  };
  const getColor = () => $currentColor;

  const setSize = async (size: Size) => {
    $size = size;
    await renderBackground();
  };
  const getSize = () => $size;

  const setBackgroundColor = async (color: number) => {
    $backgroundColor = color;
    await renderBackground();
  };
  const getBackgroundColor = () => $backgroundColor;

  const setBackgroundAlpha = async (alpha: number) => {
    $backgroundAlpha = alpha;
    await renderBackground();
  };
  const getBackgroundAlpha = () => $backgroundAlpha;

  const setBackgroundPadding = async (padding: IndividualSides) => {
    $backgroundPadding = padding;
    await renderBackground();
  };
  const getBackgroundPadding = () => $backgroundPadding;

  const setVerticalAlign = async (verticalAlign: VerticalAlign) => {
    $verticalAlign = verticalAlign;
    await renderText();
  };
  const getVerticalAlign = () => $verticalAlign;

  const setHorizontalAlign = async (horizontalAlign: HorizontalAlign) => {
    $horizontalAlign = horizontalAlign;
    await renderText();
  };
  const getHorizontalAlign = () => $horizontalAlign;

  const $getTextBounds = (): Size => $textContainer.getBounds();
  const $getCharacter = (character: string): PIXI.Texture | undefined =>
    textures[character.split("")[0]];
  const $getTextContainer = () => $textContainer;

  {
    await setText(text);
    await setColor(color);
  }

  return $containerComponent.getComponent(textSprite, {
    setText,
    getText,

    setColor,
    getColor,

    setSize,
    getSize,

    setBackgroundColor,
    getBackgroundColor,

    setBackgroundAlpha,
    getBackgroundAlpha,

    setBackgroundPadding,
    getBackgroundPadding,

    setVerticalAlign,
    getVerticalAlign,

    setHorizontalAlign,
    getHorizontalAlign,

    $getTextContainer,
    $getTextBounds,
    $getCharacter,
  });
};
