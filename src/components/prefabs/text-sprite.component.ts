import {
  ContainerComponent,
  IndividualSides,
  PartialTextSpriteMutable,
  PartialTextSpriteProps,
} from "../../types";
import { container, graphics } from "../core";
import * as PIXI from "pixi.js";
import { Size, Texture } from "pixi.js";
import { isNotNullish, normalizeAccents, processAccents } from "../../utils";
import {
  EventMode,
  GraphicType,
  HorizontalAlign,
  VerticalAlign,
} from "../../enums";
import { global } from "../../global";

export const textSprite: ContainerComponent<
  PartialTextSpriteProps,
  PartialTextSpriteMutable
> = (props) => {
  const $containerComponent = container<
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

  let $textures: Record<string, PIXI.Texture> = {};

  const $boxSize = {
    width: $size?.width + $backgroundPadding.left + $backgroundPadding.right,
    height: $size?.height + $backgroundPadding.top + $backgroundPadding.bottom,
  };

  const $background = graphics({
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

  const $mask = graphics({
    type: GraphicType.RECTANGLE,
    width: $boxSize.width,
    height: $boxSize.height,
    color: 0,
    pivot: {
      x: $backgroundPadding.left,
      y: $backgroundPadding.top,
    },
  });

  const $textContainerComponent = container({
    eventMode: EventMode.NONE,
  });
  $containerComponent.add($background, $textContainerComponent);
  withMask && $containerComponent.setMask($mask);

  const $textContainer = $textContainerComponent.getDisplayObject({
    __preventWarning: true,
  });

  const renderBackground = () => {
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
    $background.setPivot({
      x: $backgroundPadding.left,
      y: $backgroundPadding.top,
    });
    $background.setTint($backgroundColor);
    $background.setAlpha($backgroundAlpha);
  };

  const renderText = () => {
    $textContainer.removeChildren();
    $textContainer.tint = $currentColor;

    const processedText = processAccents($currentText);

    let nextPositionX = 0;
    for (const { character, accent } of processedText) {
      const $charTexture = $textures[character];
      const $accentTexture = $textures[accent];
      if (!$charTexture) continue;

      const characterSprite = new PIXI.Sprite($charTexture);
      characterSprite.position.x = nextPositionX;
      $textContainer.addChild(characterSprite);

      if ($accentTexture) {
        const accentSprite = new PIXI.Sprite($accentTexture);
        accentSprite.position.x =
          nextPositionX + $charTexture.width / 2 - $accentTexture.width / 2;
        accentSprite.position.y = -2;
        $textContainer.addChild(accentSprite);
      }

      nextPositionX = $textContainer.width + 1;
    }

    if (isNotNullish($size.width)) {
      let targetXPosition = 0;
      switch ($horizontalAlign) {
        case HorizontalAlign.CENTER:
          targetXPosition = ($size.width - $textContainer.width) / 2;
          break;
        case HorizontalAlign.RIGHT:
          targetXPosition = $size.width - $textContainer.width;
          break;
      }
      $textContainerComponent.setPositionX(targetXPosition);
    }

    if (isNotNullish($size.height)) {
      let targetYPosition = 0;
      switch ($verticalAlign) {
        case VerticalAlign.MIDDLE:
          targetYPosition = ($size.height - $textContainer.height) / 2;
          break;
        case VerticalAlign.BOTTOM:
          targetYPosition = $size.height - $textContainer.height;
          break;
      }
      $textContainerComponent.setPositionY(targetYPosition);
    }

    renderBackground();
  };

  const setText = (text: string) => {
    if (isNotNullish(text)) $currentText = text;
    renderText();
  };
  const getText = () => $currentText;

  const setColor = (color: number) => {
    if (isNotNullish(color)) $currentColor = color;
    renderText();
  };
  const getColor = () => $currentColor;

  const setSize = (size: Size) => {
    $size = size;
    renderBackground();
  };
  const getSize = () => $size;

  const setBackgroundColor = (color: number) => {
    $backgroundColor = color;
    renderBackground();
  };
  const getBackgroundColor = () => $backgroundColor;

  const setBackgroundAlpha = (alpha: number) => {
    $backgroundAlpha = alpha;
    renderBackground();
  };
  const getBackgroundAlpha = () => $backgroundAlpha;

  const setBackgroundPadding = (padding: IndividualSides) => {
    $backgroundPadding = padding;
    renderBackground();
  };
  const getBackgroundPadding = () => $backgroundPadding;

  const setVerticalAlign = (verticalAlign: VerticalAlign) => {
    $verticalAlign = verticalAlign;
    renderText();
  };
  const getVerticalAlign = () => $verticalAlign;

  const setHorizontalAlign = (horizontalAlign: HorizontalAlign) => {
    $horizontalAlign = horizontalAlign;
    renderText();
  };
  const getHorizontalAlign = () => $horizontalAlign;

  const $getTextBounds = (): Size => $textContainer.getBounds();
  const $getCharacter = (character: string): PIXI.Texture | undefined => {
    const { character: char } = normalizeAccents(character);
    return char ? $textures[char.split("")[0]] : undefined;
  };
  const $getTextContainer = () => $textContainer;

  const $render = () => {
    renderText();
    renderBackground();
  };

  {
    $textures = global.spriteSheets.get(spriteSheet).textures;

    if (!isNotNullish($size.height))
      $size.height = (Object.values($textures)[0] as Texture)?.height || 0;

    setText(text);
    setColor(color);
    renderBackground();
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

    $render,
    $getTextContainer,
    $getTextBounds,
    $getCharacter,
  });
};
