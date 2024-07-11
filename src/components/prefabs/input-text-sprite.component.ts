import {
  ContainerComponent,
  InputTextSpriteMutable,
  InputTextSpriteProps,
  PartialInputTextSpriteProps,
} from "../../types";
import { container } from "../core";
import { box } from "./box.component";
import { textSprite } from "./text-sprite.component";
import { global } from "../../global";
import { Event } from "../../enums";

export const inputTextSprite: ContainerComponent<
  InputTextSpriteProps,
  InputTextSpriteMutable
> = async (props) => {
  const $container = await container<
    PartialInputTextSpriteProps,
    InputTextSpriteMutable
  >(props);

  const ALPHABET =
    "abcdefghijklmnñopqrstuvwxyz1234567890!#€%&()*+-./:;<=>?¿@[]^_{}| ".split(
      "",
    );

  let $text = "";
  let $editable = false;
  let $cursorPosition = 0;
  let $cursorInterval: number;

  const $textSprite = await textSprite({
    spriteSheet: props.spriteSheet,
    color: props.color,
    text: "",
  });
  const { height } = $textSprite.$getSize("A");

  const $cursor = await box({
    width: 1,
    height: height,
    mass: 0,
    color: props.color,
    pivot: { x: 0, y: -height / 2 },
  });

  const $startCursorBlink = () => {
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

  const onKeyDown = ({ key }) => {
    $stopCursorBlink();
    if (!$editable || $text.length === 0) return;

    if (key === "Backspace" && $cursorPosition > 0) {
      const letter = $text[$cursorPosition - 1];
      const { width } = $textSprite.$getSize(letter);

      $text =
        $text.slice(0, $cursorPosition - 1) + $text.slice($cursorPosition);
      $textSprite.setText($text);
      $cursorPosition--;
      $cursor.setPositionX((x) => x - width - 1);
      return;
    }

    if (key === "Delete" && $cursorPosition < $text.length) {
      $text =
        $text.slice(0, $cursorPosition) + $text.slice($cursorPosition + 1);
      $textSprite.setText($text);
      return;
    }

    if (key === "ArrowLeft" && $cursorPosition > 0) {
      const letter = $text[$cursorPosition - 1];
      const { width } = $textSprite.$getSize(letter);

      $cursorPosition--;
      $cursor.setPositionX((x) => x - width - 1);
      return;
    }

    if (key === "ArrowRight" && $cursorPosition < $text.length) {
      const letter = $text[$cursorPosition];
      const { width } = $textSprite.$getSize(letter);

      $cursorPosition++;
      $cursor.setPositionX((x) => x + width + 1);
      return;
    }
  };

  const onKeyPress = ({ key }) => {
    if (!$editable || !ALPHABET.includes(key.toLowerCase())) {
      return;
    }

    $text =
      $text.slice(0, $cursorPosition) + key + $text.slice($cursorPosition);

    $cursorPosition++;
    $textSprite.setText($text);
    const { width } = $textSprite.$getSize(key);
    $cursor.setPositionX((x) => x + width + 1);
  };

  const onKeyUp = () => {
    $startCursorBlink();
  };

  global.events.on(Event.KEY_DOWN, onKeyDown, $textSprite);
  global.events.on(Event.KEY_PRESS, onKeyPress, $textSprite);
  global.events.on(Event.KEY_UP, onKeyUp, $textSprite);

  $container.add($cursor, $textSprite);

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

  setEditable(props.editable ?? true);

  return $container.getComponent(inputTextSprite, {
    setEditable,
    getText,
    reset,
  });
};
