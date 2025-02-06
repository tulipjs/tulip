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
  Cursor,
  DisplayObjectEvent,
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
    withMask = true,
    lineJump = true,
    accentYCorrection = 0,
    lineHeight = 0,
    allowLinks = false,
    parseMarkdown = false,
    linkColor = 0x0000ff,
  } = $containerComponent.getProps();

  let $currentText = text;
  let $currentColor = color;
  let $size = {
    width: size?.width,
    height: size?.height,
  };
  let $backgroundAlpha = backgroundAlpha ?? (backgroundColor ? 1 : 0);
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
  let initialCharHeight = 0;

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

  const $textContainerComponent = container({
    eventMode: EventMode.AUTO,
  });
  $containerComponent.add($background, $textContainerComponent);

  if (withMask && $size?.width && $size?.height) {
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
    $containerComponent.setMask($mask);
  }

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

  const processLinks = (text: string) => {
    const segments: Array<{ text: string; url?: string }> = [];
    let remainingText = text;

    const linkRegex = parseMarkdown
      ? /\[([^\]]+)\]\(([^)]+)\)/g
      : /(https?:\/\/[^\s]+)/g;

    let match;
    let lastIndex = 0;
    while ((match = linkRegex.exec(remainingText)) !== null) {
      if (match.index > lastIndex) {
        segments.push({
          text: remainingText.slice(lastIndex, match.index),
        });
      }

      const [fullMatch, linkText, linkUrl] = match;
      const url = parseMarkdown ? linkUrl : fullMatch;
      const text = parseMarkdown ? linkText : fullMatch;

      segments.push({
        text,
        url,
      });

      lastIndex = match.index + fullMatch.length;
    }

    if (lastIndex < remainingText.length) {
      segments.push({
        text: remainingText.slice(lastIndex),
      });
    }

    return segments;
  };

  const renderText = () => {
    $textContainer.removeChildren();
    $textContainer.tint = $currentColor;

    const $getChar = (character: string, accent?: string) => {
      const list = [];
      const $charTexture = $textures[character];
      const $accentTexture = $textures[accent];
      if (!$charTexture) return;

      const characterSprite = new PIXI.Sprite($charTexture);
      list.push(characterSprite);

      if ($accentTexture) {
        const accentSprite = new PIXI.Sprite($accentTexture);
        accentSprite.position.x =
          $charTexture.width / 2 - $accentTexture.width / 2;
        accentSprite.position.y = accentYCorrection;
        list.push(accentSprite);
      }

      return list;
    };

    const $getWord = (word: string): [any[], number] => {
      let width = 0;
      const list = [];
      const processedWord = processAccents(word);
      for (const { character, accent } of processedWord) {
        const char = $getChar(character, accent);
        if (!char) continue;
        const [charSprite] = char;
        width += charSprite.width + 1;
        list.push(char);
      }
      return [list, width - 1];
    };

    let nextPositionX = 0;
    let nextPositionY = 0;
    const hasSize = isNotNullish($size?.width) && isNotNullish($size?.height);

    const $render = ({ text, url }: { text: string; url?: string }) => {
      const wordList = text.split(" ");

      let initialX = nextPositionX;
      let initialY = nextPositionY;

      for (let wordIndex = 0; wordIndex < wordList.length; wordIndex++) {
        const [charList, width] = $getWord(wordList[wordIndex]);

        if (lineJump && hasSize && nextPositionX + width > $size.width) {
          nextPositionY += charList[0][0].height + lineHeight;
          nextPositionX = 0;
        }
        for (const [char, accent] of charList) {
          $textContainer.addChild(char);
          char.position.x += nextPositionX;
          char.position.y = nextPositionY;

          if (allowLinks && url) {
            char.tint = linkColor;
          }

          if (accent) {
            $textContainer.addChild(accent);
            accent.position.x = char.position.x;
            accent.pivot.x = accent.width / 2 - char.width / 2;
            accent.position.y = nextPositionY + accentYCorrection;
          }

          nextPositionX += char.width + 1;
        }
        if (wordList.length - 1 === wordIndex) break;
        //add spaces
        const char = $getChar(" ");
        if (!char) continue;
        const [spaceChar] = char;
        $textContainer.addChild(spaceChar);
        spaceChar.position.x += nextPositionX;
        nextPositionX += spaceChar.width;
      }

      if (allowLinks && url) {
        const $rectangle = graphics({
          type: GraphicType.RECTANGLE,
          width: nextPositionX - initialX,
          height: initialCharHeight,
          tint: 0x00ff00,
          alpha: 0,
          eventMode: EventMode.STATIC,
          cursor: Cursor.POINTER,
          position: {
            x: initialX,
            y: initialY,
          },
        });
        $rectangle.on(DisplayObjectEvent.POINTER_DOWN, () =>
          window.open(url, "_blank"),
        );

        $textContainer.addChild(
          $rectangle.getDisplayObject({ __preventWarning: true }),
        );
      }
    };

    const segments = processLinks($currentText);
    segments.forEach((segment) => $render(segment));

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
          targetYPosition = ($size.height - initialCharHeight) / 2;
          break;
        case VerticalAlign.BOTTOM:
          targetYPosition = $size.height - initialCharHeight;
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

    initialCharHeight = (Object.values($textures)[0] as Texture)?.height || 0;
    if (!isNotNullish($size.height)) $size.height = initialCharHeight;

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
