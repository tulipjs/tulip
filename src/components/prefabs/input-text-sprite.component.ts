import {
  ContainerComponent,
  InputTextSpriteMutable,
  InputTextSpriteProps,
  PartialInputTextSpriteProps,
} from "../../types";
import { container, graphics } from "../core";
import { textSprite } from "./text-sprite.component";
import { global } from "../../global";
import {
  DisplayObjectEvent,
  Event,
  EventMode,
  GraphicType,
  HorizontalAlign,
} from "../../enums";
import { closeKeyboard, isNotNullish, openKeyboard } from "../../utils";

export const inputTextSprite: ContainerComponent<
  InputTextSpriteProps,
  InputTextSpriteMutable
> = async ({ onTextChange, ...props }) => {
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
    zIndex,
    selectionVisible,
    selectionColor,
    selectionGap,
    selectionPadding,
    ...textSpriteProps
  } = $container.getProps();

  let $text = defaultValue || "";
  let $editable = false;
  let $cursorIndex = 0;
  let $cursorInterval: number;

  let $placeholder = placeholder || "";
  let $placeHolderAlpha = placeHolderAlpha || 0.5;

  let $maxLength = maxLength;

  let $selectionVisible = isNotNullish(selectionVisible)
    ? selectionVisible
    : true;
  let $selectionColor = isNotNullish(selectionColor)
    ? selectionColor
    : 0x00ff00;
  let $selectionGap = isNotNullish(selectionGap) ? selectionGap : 1;
  let $selectionPadding = isNotNullish(selectionPadding) ? selectionPadding : 1;

  const $textSprite = await textSprite({
    ...textSpriteProps,
    text: $text,
  });

  const $selectionComponent = await graphics({
    type: GraphicType.POLYGON,
    visible: false,
    polygon: [],
    color: $selectionColor,
  });

  const $renderSelection = () => {
    const focusWidth = $selectionGap;
    const focusOutPadding = focusWidth + $selectionPadding;
    const focusSize = textSpriteProps.size;
    $selectionComponent.setColor($selectionColor);
    $selectionComponent.setPolygon([
      -focusOutPadding - textSpriteProps.backgroundPadding.left,
      -focusOutPadding - textSpriteProps.backgroundPadding.top,
      //
      focusSize.width +
        focusOutPadding +
        textSpriteProps.backgroundPadding.right,
      -focusOutPadding - textSpriteProps.backgroundPadding.top,
      //
      focusSize.width +
        focusOutPadding +
        textSpriteProps.backgroundPadding.right,
      focusSize.height +
        focusOutPadding +
        textSpriteProps.backgroundPadding.bottom,
      //
      -focusOutPadding - textSpriteProps.backgroundPadding.left,
      focusSize.height +
        focusOutPadding +
        textSpriteProps.backgroundPadding.bottom,
      //
      -focusOutPadding - textSpriteProps.backgroundPadding.left,
      -focusOutPadding - textSpriteProps.backgroundPadding.top,
      //----
      -focusWidth - textSpriteProps.backgroundPadding.left,
      -focusOutPadding - textSpriteProps.backgroundPadding.top,
      //
      -focusWidth - textSpriteProps.backgroundPadding.left,
      focusSize.height + focusWidth + textSpriteProps.backgroundPadding.bottom,
      //
      focusSize.width + focusWidth + textSpriteProps.backgroundPadding.right,
      focusSize.height + focusWidth + textSpriteProps.backgroundPadding.bottom,
      //
      focusSize.width + focusWidth + textSpriteProps.backgroundPadding.right,
      -focusWidth - textSpriteProps.backgroundPadding.top,
      //
      -focusWidth - textSpriteProps.backgroundPadding.right,
      -focusWidth - textSpriteProps.backgroundPadding.top,
    ]);
  };
  $renderSelection();

  const $placeHolderTextSprite = await textSprite({
    spriteSheet: textSpriteProps.spriteSheet,
    text: $placeholder,
    color: textSpriteProps.color,
    pivot: textSpriteProps.pivot,
    alpha: $placeHolderAlpha,
    visible: $text.length === 0,
    eventMode: EventMode.NONE,
    size: textSpriteProps.size,
    verticalAlign: textSpriteProps.verticalAlign,
    horizontalAlign: textSpriteProps.horizontalAlign,
  });

  const $passwordCharText = passwordChar?.length
    ? passwordChar?.split("")[0]
    : undefined;
  const $passwordChar = $passwordCharText
    ? $textSprite.$getCharacter($passwordCharText)
    : undefined;
  const { height } = $textSprite.$getCharacter("a");

  const $cursorTextSprite = await textSprite({
    spriteSheet: textSpriteProps.spriteSheet,
    text: $text,
    alpha: 0,
    eventMode: EventMode.NONE,
  });

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

  const getTextSize = () => {
    const $size = $textSprite.getSize();

    return $size.width ? $size : $textSprite.$getTextBounds();
  };

  const calcCursorPosition = async () => {
    const text = $getCurrentText();
    await $cursorTextSprite.setText(text.slice(0, $cursorIndex));
    await $cursor.setPositionX($cursorTextSprite.getBounds().width);

    const $size = getTextSize();
    //Fix when you navigate cursor to the 0
    const index0Fix = $cursorTextSprite.getBounds().width > 0 ? 0 : 1;
    switch ($textSprite.getHorizontalAlign()) {
      case HorizontalAlign.CENTER:
        await $cursor.setPivotX(
          (-$size.width + $textSprite.$getTextBounds().width - 1) / 2 +
            index0Fix,
        );
        break;
      case HorizontalAlign.LEFT:
        await $cursor.setPivotX(index0Fix);
        break;
      case HorizontalAlign.RIGHT:
        await $cursor.setPivotX(
          -($size.width || 0) + $textSprite.$getTextBounds().width,
        );
        break;
    }
  };

  const onKeyDown = async ({ key }: KeyboardEvent) => {
    $stopCursorBlink();
    if (!$editable || $text.length === 0) return;

    if (key === "Backspace" && $cursorIndex > 0) {
      $text = $text.slice(0, $cursorIndex - 1) + $text.slice($cursorIndex);
      await $textSprite.setText($getCurrentText());

      $cursorIndex--;
      await calcCursorPosition();

      renderPlaceHolder();
      return;
    }

    if (key === "Delete" && $cursorIndex < $text.length) {
      $text = $text.slice(0, $cursorIndex) + $text.slice($cursorIndex + 1);
      await $textSprite.setText($getCurrentText());

      await calcCursorPosition();

      renderPlaceHolder();
      return;
    }

    if (key === "ArrowLeft" && $cursorIndex > 0) {
      $cursorIndex--;
      await calcCursorPosition();

      renderPlaceHolder();
      return;
    }

    if (key === "ArrowRight" && $cursorIndex < $text.length) {
      $cursorIndex++;
      await calcCursorPosition();

      renderPlaceHolder();
      return;
    }
  };

  const onKeyPress = async ({ key }: KeyboardEvent) => {
    if (key.length !== 1) return;
    if (!$editable) {
      return;
    }
    const character = $textSprite.$getCharacter(key);
    if (!character) return;

    if ($maxLength && $text.length + 1 > $maxLength) return;

    const targetText =
      $text.slice(0, $cursorIndex) + key + $text.slice($cursorIndex);
    if (onTextChange && !onTextChange?.($text, targetText)) return;

    $text = targetText;

    $cursorIndex++;
    await $textSprite.setText($getCurrentText());

    await calcCursorPosition();

    renderPlaceHolder();
  };

  const onKeyUp = () => {
    $startCursorBlink();
    renderPlaceHolder();
  };

  let removeOnKeyDown;
  let removeOnKeyPress;
  let removeOnKeyUp;

  $container.on(DisplayObjectEvent.CONTEXT_ENTER, async () => {
    removeOnKeyDown = global.events.on(Event.KEY_DOWN, onKeyDown, $textSprite);
    removeOnKeyPress = global.events.on(
      Event.KEY_PRESS,
      onKeyPress,
      $textSprite,
    );
    removeOnKeyUp = global.events.on(Event.KEY_UP, onKeyUp, $textSprite);

    //Move cursor to end
    $cursorIndex = $text.length;
    await $cursor.setPositionX($textSprite.$getTextBounds().width + 1);

    await calcCursorPosition();

    setEditable(props.editable ?? true);
    $startCursorBlink();

    if ($selectionVisible) await $selectionComponent.setVisible(true);

    openKeyboard();
  });
  $container.on(DisplayObjectEvent.CONTEXT_LEAVE, async () => {
    setEditable(false);

    removeOnKeyDown();
    removeOnKeyPress();
    removeOnKeyUp();

    await $selectionComponent.setVisible(false);

    closeKeyboard();
  });

  $container.add(
    $textSprite,
    $placeHolderTextSprite,
    $cursor,
    $cursorTextSprite,
    $selectionComponent,
  );

  const setEditable = (editable: boolean) => {
    $editable = editable;
    $editable ? $startCursorBlink() : $stopCursorBlink(false);
  };

  const getText = () => $text;
  const reset = () => {
    $text = "";
    $cursorIndex = 0;
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

    setSize: async (size) => {
      await $textSprite.setSize(size);
      $renderSelection();
    },
    getSize: $textSprite.getSize,

    setBackgroundColor: $textSprite.setBackgroundColor,
    getBackgroundColor: $textSprite.getBackgroundColor,

    setBackgroundAlpha: $textSprite.setBackgroundAlpha,
    getBackgroundAlpha: $textSprite.getBackgroundAlpha,

    setBackgroundPadding: async (padding) => {
      await $textSprite.setBackgroundPadding(padding);
      $renderSelection();
    },
    getBackgroundPadding: $textSprite.getBackgroundPadding,

    setSelectionVisible: (visible: boolean) => {
      $selectionVisible = visible;
      $renderSelection();
    },
    getSelectionVisible: () => $selectionVisible,

    setSelectionColor: (color: number) => {
      $selectionColor = color;
      $renderSelection();
    },
    getSelectionColor: () => $selectionColor,

    setSelectionGap: (gap: number) => {
      $selectionGap = gap;
      $renderSelection();
    },
    getSelectionGap: () => $selectionGap,

    setSelectionPadding: (padding: number) => {
      $selectionPadding = padding;
      $renderSelection();
    },
    getSelectionPadding: () => $selectionPadding,
  });
};
