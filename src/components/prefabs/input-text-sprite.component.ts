import {
  ContainerComponent,
  InputTextSpriteMutable,
  InputTextSpriteProps,
  PartialInputTextSpriteProps,
} from "../../types";
import { container, graphics } from "../core";
import { textSprite } from "./text-sprite.component";
import { global } from "../../global";
import { DisplayObjectEvent, Event, EventMode, GraphicType } from "../../enums";
import { closeKeyboard, openKeyboard } from "../../utils";
import { Texture } from "pixi.js";

export const inputTextSprite: ContainerComponent<
  InputTextSpriteProps,
  InputTextSpriteMutable
> = async (props) => {
  const $container = await container<
    PartialInputTextSpriteProps,
    InputTextSpriteMutable
  >(props);

  const {
    passwordChar,
    defaultValue,
    position,
    placeholder,
    placeHolderAlpha,
    maxLength,
    ...textSpriteProps
  } = $container.getProps();

  let $text = defaultValue || "";
  let $editable = false;
  let $cursorPosition = 0;
  let $cursorInterval: number;

  let $placeholder = placeholder || "";
  let $placeHolderAlpha = placeHolderAlpha || 0.5;

  let $maxLength = maxLength;

  const $textSprite = await textSprite({
    ...textSpriteProps,
    text: $text,
  });

  const $placeHolderTextSprite = await textSprite({
    spriteSheet: textSpriteProps.spriteSheet,
    text: $placeholder,
    color: textSpriteProps.color,
    pivot: textSpriteProps.pivot,
    alpha: $placeHolderAlpha,
    visible: $text.length === 0,
  });

  const $passwordCharText = passwordChar?.length
    ? passwordChar?.split("")[0]
    : undefined;
  const $passwordChar = $passwordCharText
    ? $textSprite.$getCharacter($passwordCharText)
    : undefined;
  const { height } = $textSprite.$getCharacter("a");

  const $cursor = await graphics({
    type: GraphicType.RECTANGLE,
    width: 1,
    height: height + 3,
    color: props.color,
    visible: false,
    pivot: { x: 1, y: 2 },
    eventMode: EventMode.NONE,
  });

  const $startCursorBlink = () => {
    $cursor.setVisible(true);
    clearInterval($cursorInterval);
    // @ts-ignore
    $cursorInterval = setInterval(() => {
      $cursor.setVisible((v) => !v);
    }, 530);
  };
  const $stopCursorBlink = (visible = true) => {
    clearInterval($cursorInterval);
    $cursor.setVisible(visible);
  };

  const $getCurrentText = () =>
    $passwordChar
      ? $text
          .split("")
          .map(() => $passwordCharText)
          .join("")
      : $text;

  const renderPlaceHolder = () => {
    $placeHolderTextSprite.setVisible($text.length === 0);
  };

  const onKeyDown = ({ key }) => {
    $stopCursorBlink();
    if (!$editable || $text.length === 0) return;

    let character: Texture;
    let characterWidth: number;

    if (key === "Backspace" && $cursorPosition > 0) {
      character = $textSprite.$getCharacter($text[$cursorPosition - 1]);
      characterWidth = $passwordChar?.width || character?.width;
      if (!characterWidth) return;

      $text =
        $text.slice(0, $cursorPosition - 1) + $text.slice($cursorPosition);
      $textSprite.setText($getCurrentText());
      $cursorPosition--;
      $cursor.setPositionX((x) => x - characterWidth - 1);
      renderPlaceHolder();
      return;
    }

    if (key === "Delete" && $cursorPosition < $text.length) {
      $text =
        $text.slice(0, $cursorPosition) + $text.slice($cursorPosition + 1);
      $textSprite.setText($getCurrentText());
      renderPlaceHolder();
      return;
    }

    if (key === "ArrowLeft" && $cursorPosition > 0) {
      character = $textSprite.$getCharacter($text[$cursorPosition - 1]);
      characterWidth = $passwordChar?.width || character?.width;
      if (!characterWidth) return;

      $cursorPosition--;
      $cursor.setPositionX((x) => x - characterWidth - 1);
      renderPlaceHolder();
      return;
    }

    if (key === "ArrowRight" && $cursorPosition < $text.length) {
      character = $textSprite.$getCharacter($text[$cursorPosition]);
      characterWidth = $passwordChar?.width || character?.width;
      if (!characterWidth) return;

      $cursorPosition++;
      $cursor.setPositionX((x) => x + characterWidth + 1);
      renderPlaceHolder();
      return;
    }
  };

  const onKeyPress = ({ key }) => {
    if (!$editable) {
      return;
    }
    const character = $textSprite.$getCharacter(key);
    const characterWidth = $passwordChar?.width || character?.width;
    if (!character) return;

    if ($maxLength && $text.length + 1 > $maxLength) return;

    $text =
      $text.slice(0, $cursorPosition) + key + $text.slice($cursorPosition);

    $cursorPosition++;
    $textSprite.setText($getCurrentText());
    $cursor.setPositionX((x) => x + characterWidth + 1);
    renderPlaceHolder();
  };

  const onKeyUp = () => {
    $startCursorBlink();
    renderPlaceHolder();
  };

  let removeOnKeyDown;
  let removeOnKeyPress;
  let removeOnKeyUp;

  $container.on(DisplayObjectEvent.CONTEXT_ENTER, () => {
    removeOnKeyDown = global.events.on(Event.KEY_DOWN, onKeyDown, $textSprite);
    removeOnKeyPress = global.events.on(
      Event.KEY_PRESS,
      onKeyPress,
      $textSprite,
    );
    removeOnKeyUp = global.events.on(Event.KEY_UP, onKeyUp, $textSprite);

    //Move cursor to end
    $cursorPosition = $text.length;
    $cursor.setPositionX($textSprite.$getTextBounds().width + 1);

    setEditable(props.editable ?? true);
    $startCursorBlink();

    openKeyboard();
  });
  $container.on(DisplayObjectEvent.CONTEXT_LEAVE, () => {
    setEditable(false);

    removeOnKeyDown();
    removeOnKeyPress();
    removeOnKeyUp();

    closeKeyboard();
  });

  $container.add($textSprite, $placeHolderTextSprite, $cursor);

  const setEditable = (editable: boolean) => {
    $editable = editable;
    $editable ? $startCursorBlink() : $stopCursorBlink(false);
  };

  const getText = () => $textSprite.getText();
  const reset = () => {
    $text = "";
    $cursorPosition = 0;
    $cursor.setPosition({ x: 0, y: 0 });

    setEditable($editable);

    $textSprite.setText("");
  };

  return $container.getComponent(inputTextSprite, {
    setEditable,
    getText,
    reset,

    setColor: $textSprite.setColor,
    getColor: $textSprite.getColor,

    getSize: $textSprite.getSize,
    setSize: $textSprite.setSize,

    getBackgroundColor: $textSprite.getBackgroundColor,
    setBackgroundColor: $textSprite.setBackgroundColor,

    getBackgroundAlpha: $textSprite.getBackgroundAlpha,
    setBackgroundAlpha: $textSprite.setBackgroundAlpha,

    getBackgroundPadding: $textSprite.getBackgroundPadding,
    setBackgroundPadding: $textSprite.setBackgroundPadding,
  });
};
