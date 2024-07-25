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
  VerticalAlign,
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
  const $contentContainer = await container();

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
    withMask = false,
    autoFocus = true,
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
    withMask: false,
  });

  const $selectionComponent = await graphics({
    type: GraphicType.POLYGON,
    visible: false,
    polygon: [],
    color: $selectionColor,
  });

  const $placeHolderTextSprite = await textSprite({
    spriteSheet: textSpriteProps.spriteSheet,
    color: $textSprite.getColor(),
    pivot: $textSprite.getPivot(),
    size: $textSprite.getSize(),
    verticalAlign: $textSprite.getVerticalAlign(),
    horizontalAlign: $textSprite.getHorizontalAlign(),
    //
    text: $placeholder,
    alpha: $placeHolderAlpha,
    visible: $text.length === 0,
    eventMode: EventMode.NONE,
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
    tint: props.color,
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

  const getTextSize = () => {
    const $size = $textSprite.getSize();

    return $size.width ? $size : $textSprite.$getTextBounds();
  };

  const calcCursorPosition = async () => {
    const text = $getCurrentText();
    await $cursorTextSprite.setText(text.slice(0, $cursorIndex));

    const $cursorPositionX = $cursorTextSprite.$getTextBounds().width;
    await $cursor.setPositionX($cursorPositionX);

    const $size = getTextSize();
    const $maxWidth = $textSprite.getSize().width;

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
        const $extraCursorXRightPivot = $cursorPositionX - $maxWidth;
        const $correctionXRight =
          $extraCursorXRightPivot > 0 ? $extraCursorXRightPivot : 0;

        await $cursor.setPivotX(index0Fix + $correctionXRight);
        $textSprite.$getTextContainer().position.x = -$correctionXRight;
        break;
      case HorizontalAlign.RIGHT:
        const $cursorPivotX =
          -($size.width || 0) + $textSprite.$getTextBounds().width;

        const $extraCursorXPivot = $cursorPositionX - $cursorPivotX;
        const $correctionXLeft =
          0 > $extraCursorXPivot ? $extraCursorXPivot : 0;

        await $cursor.setPivotX($cursorPivotX + $correctionXLeft);
        $textSprite.$getTextContainer().pivot.x = $correctionXLeft;
        break;
    }

    const index0VerticalFix =
      $textSprite.$getTextBounds().height > 0 ? 0 : height;
    const $cursorPivotY =
      -($size.height || 0) +
      $textSprite.$getTextBounds().height +
      2 +
      index0VerticalFix;

    switch ($textSprite.getVerticalAlign()) {
      case VerticalAlign.MIDDLE:
        await $cursor.setPivotY($cursorPivotY / 2);
        break;
      case VerticalAlign.BOTTOM:
        await $cursor.setPivotY($cursorPivotY);
        break;
    }

    await $placeHolderTextSprite.setVisible($text.length === 0);
  };

  const $renderSelection = async () => {
    const focusWidth = $selectionGap;
    const focusOutPadding = focusWidth + $selectionPadding;
    const focusSize = $textSprite?.getSize() || { width: 0, height: 0 };
    const backgroundPadding = $textSprite?.getBackgroundPadding() || {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    };

    const $mask = await graphics({
      type: GraphicType.RECTANGLE,
      width: focusSize.width + backgroundPadding.left + backgroundPadding.right,
      height:
        focusSize.height + backgroundPadding.bottom + backgroundPadding.top,
      color: 0,
      pivot: {
        x: backgroundPadding.left,
        y: backgroundPadding.top,
      },
    });
    withMask && $contentContainer.setMask($mask);

    await $selectionComponent.setTint($selectionColor);
    $selectionComponent.setPolygon([
      -focusOutPadding - backgroundPadding.left,
      -focusOutPadding - backgroundPadding.top,
      //
      focusSize.width + focusOutPadding + backgroundPadding.right,
      -focusOutPadding - backgroundPadding.top,
      //
      focusSize.width + focusOutPadding + backgroundPadding.right,
      focusSize.height + focusOutPadding + backgroundPadding.bottom,
      //
      -focusOutPadding - backgroundPadding.left,
      focusSize.height + focusOutPadding + backgroundPadding.bottom,
      //
      -focusOutPadding - backgroundPadding.left,
      -focusOutPadding - backgroundPadding.top,
      //----
      -focusWidth - backgroundPadding.left,
      -focusOutPadding - backgroundPadding.top,
      //
      -focusWidth - backgroundPadding.left,
      focusSize.height + focusWidth + backgroundPadding.bottom,
      //
      focusSize.width + focusWidth + backgroundPadding.right,
      focusSize.height + focusWidth + backgroundPadding.bottom,
      //
      focusSize.width + focusWidth + backgroundPadding.right,
      -focusWidth - backgroundPadding.top,
      //
      -focusWidth - backgroundPadding.right,
      -focusWidth - backgroundPadding.top,
    ]);

    //placeholder
    await $placeHolderTextSprite.setColor($textSprite.getColor());
    await $placeHolderTextSprite.setPivot($textSprite.getPivot());
    await $placeHolderTextSprite.setSize($textSprite.getSize());
    await $placeHolderTextSprite.setVerticalAlign(
      $textSprite.getVerticalAlign(),
    );
    await $placeHolderTextSprite.setHorizontalAlign(
      $textSprite.getHorizontalAlign(),
    );
    //cursor
    await calcCursorPosition();
    //text
    await $textSprite.$render();
  };
  await $renderSelection();

  const onKeyDown = async ({ key }: KeyboardEvent) => {
    $stopCursorBlink();
    await writeText(key);
    await makeActions(key);
  };

  const makeActions = async (key: string) => {
    if (!$editable || $text.length === 0) return;

    if (key === "Backspace" && $cursorIndex > 0) {
      $text = $text.slice(0, $cursorIndex - 1) + $text.slice($cursorIndex);
      await $textSprite.setText($getCurrentText());

      $cursorIndex--;
      await calcCursorPosition();
      return;
    }

    if (key === "Delete" && $cursorIndex < $text.length) {
      $text = $text.slice(0, $cursorIndex) + $text.slice($cursorIndex + 1);
      await $textSprite.setText($getCurrentText());

      await calcCursorPosition();
      return;
    }

    if (key === "ArrowLeft" && $cursorIndex > 0) {
      $cursorIndex--;
      await calcCursorPosition();
      return;
    }

    if (key === "ArrowRight" && $cursorIndex < $text.length) {
      $cursorIndex++;
      await calcCursorPosition();
      return;
    }
  };

  const writeText = async (key: string) => {
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
  };

  const onKeyUp = () => {
    $startCursorBlink();
  };

  let removeOnKeyDown: () => void;
  let removeOnKeyUp: () => void;

  $container.on(DisplayObjectEvent.CONTEXT_ENTER, async () => {
    removeOnKeyDown = global.events.on(Event.KEY_DOWN, onKeyDown, $textSprite);
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
    removeOnKeyUp();

    await $selectionComponent.setVisible(false);

    closeKeyboard();
  });

  $contentContainer.add(
    $textSprite,
    $placeHolderTextSprite,
    $cursor,
    $cursorTextSprite,
  );

  $container.add($contentContainer, $selectionComponent);

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

  autoFocus &&
    $container.on(DisplayObjectEvent.POINTER_TAP, () => $container.focus());

  return $container.getComponent(inputTextSprite, {
    setEditable,
    getText,
    reset,

    setColor: $textSprite.setTint,
    getColor: $textSprite.getColor,

    setSize: async (size) => {
      await $textSprite.setSize(size);
      await $renderSelection();
    },
    getSize: $textSprite.getSize,

    setBackgroundColor: $textSprite.setBackgroundColor,
    getBackgroundColor: $textSprite.getBackgroundColor,

    setBackgroundAlpha: $textSprite.setBackgroundAlpha,
    getBackgroundAlpha: $textSprite.getBackgroundAlpha,

    setBackgroundPadding: async (padding) => {
      await $textSprite.setBackgroundPadding(padding);
      await $renderSelection();
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
