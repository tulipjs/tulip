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
> = ({ onTextChange, ...props }) => {
  const $container = container<
    PartialInputTextSpriteProps,
    InputTextSpriteMutable
  >(props);
  const $contentContainer = container();

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

  const $textSprite = textSprite({
    ...textSpriteProps,
    text: $text,
    withMask: false,
  });

  const $passwordCharText = passwordChar?.length
    ? passwordChar?.split("")[0]
    : undefined;

  const $selectionComponent = graphics({
    type: GraphicType.POLYGON,
    visible: false,
    polygon: [],
    color: $selectionColor,
  });

  const $placeHolderTextSprite = textSprite({
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

  const $cursorTextSprite = textSprite({
    spriteSheet: textSpriteProps.spriteSheet,
    text: $text,
    alpha: 0,
    eventMode: EventMode.NONE,
  });

  const $cursor = graphics({
    type: GraphicType.RECTANGLE,
    width: 1,
    height: 3,
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
    $textSprite.$getCharacter($passwordCharText)
      ? $text
          .split("")
          .map(() => $passwordCharText)
          .join("")
      : $text;

  const getTextSize = () => {
    const $size = $textSprite.getSize();

    return $size.width ? $size : $textSprite.$getTextBounds();
  };

  const calcCursorPosition = () => {
    const text = $getCurrentText();
    $cursorTextSprite.setText(text.slice(0, $cursorIndex));

    const $cursorPositionX = $cursorTextSprite.$getTextBounds().width;
    $cursor.setPositionX($cursorPositionX);

    const $size = getTextSize();
    const $maxWidth = $textSprite.getSize().width;

    //Fix when you navigate cursor to the 0
    const index0Fix = $cursorTextSprite.getBounds().width > 0 ? 0 : 1;
    switch ($textSprite.getHorizontalAlign()) {
      case HorizontalAlign.CENTER:
        $cursor.setPivotX(
          (-$size.width + $textSprite.$getTextBounds().width - 1) / 2 +
            index0Fix,
        );
        break;
      case HorizontalAlign.LEFT:
        const $extraCursorXRightPivot = $cursorPositionX - $maxWidth;
        const $correctionXRight =
          $extraCursorXRightPivot > 0 ? $extraCursorXRightPivot : 0;

        $cursor.setPivotX(index0Fix + $correctionXRight);
        $textSprite.$getTextContainer().position.x = -$correctionXRight;
        break;
      case HorizontalAlign.RIGHT:
        const $cursorPivotX =
          -($size.width || 0) + $textSprite.$getTextBounds().width;

        const $extraCursorXPivot = $cursorPositionX - $cursorPivotX;
        const $correctionXLeft =
          0 > $extraCursorXPivot ? $extraCursorXPivot : 0;

        $cursor.setPivotX($cursorPivotX + $correctionXLeft);
        $textSprite.$getTextContainer().pivot.x = $correctionXLeft;
        break;
    }
    const { height } = $textSprite.$getCharacter("a");

    const index0VerticalFix =
      $textSprite.$getTextBounds().height > 0 ? 0 : height;
    const $cursorPivotY =
      -($size.height || 0) +
      $textSprite.$getTextBounds().height +
      2 +
      index0VerticalFix;

    switch ($textSprite.getVerticalAlign()) {
      case VerticalAlign.MIDDLE:
        $cursor.setPivotY($cursorPivotY / 2);
        break;
      case VerticalAlign.BOTTOM:
        $cursor.setPivotY($cursorPivotY);
        break;
    }

    $placeHolderTextSprite.setVisible($text.length === 0);
  };

  const $renderSelection = () => {
    const focusWidth = $selectionGap;
    const focusOutPadding = focusWidth + $selectionPadding;
    const focusSize = $textSprite?.getSize() || { width: 0, height: 0 };
    const backgroundPadding = $textSprite?.getBackgroundPadding() || {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    };

    const $mask = graphics({
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

    $selectionComponent.setTint($selectionColor);
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
    $placeHolderTextSprite.setColor($textSprite.getColor());
    $placeHolderTextSprite.setPivot($textSprite.getPivot());
    $placeHolderTextSprite.setSize($textSprite.getSize());
    $placeHolderTextSprite.setVerticalAlign($textSprite.getVerticalAlign());
    $placeHolderTextSprite.setHorizontalAlign($textSprite.getHorizontalAlign());
    //cursor
    calcCursorPosition();
    //text
    $textSprite.$render();
  };

  const onKeyDown = async ({ key, metaKey, ctrlKey }: KeyboardEvent) => {
    if ((metaKey || ctrlKey) && key.toLowerCase() === "v") {
      // @ts-ignore
      await navigator.permissions.query({ name: "clipboard-read" });
      const text = await navigator.clipboard.readText();
      setText(`${$text}${text}`);
      return;
    }

    $stopCursorBlink();
    writeText(key);
    makeActions(key);
  };

  const makeActions = (key: string) => {
    if (!$editable || $text.length === 0) return;

    if (key === "Backspace" && $cursorIndex > 0) {
      $text = $text.slice(0, $cursorIndex - 1) + $text.slice($cursorIndex);
      $textSprite.setText($getCurrentText());

      $cursorIndex--;
      calcCursorPosition();
      return;
    }

    if (key === "Delete" && $cursorIndex < $text.length) {
      $text = $text.slice(0, $cursorIndex) + $text.slice($cursorIndex + 1);
      $textSprite.setText($getCurrentText());

      calcCursorPosition();
      return;
    }

    if (key === "ArrowLeft" && $cursorIndex > 0) {
      $cursorIndex--;
      calcCursorPosition();
      return;
    }

    if (key === "ArrowRight" && $cursorIndex < $text.length) {
      $cursorIndex++;
      calcCursorPosition();
      return;
    }
  };

  const writeText = (key: string) => {
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
    $textSprite.setText($getCurrentText());

    calcCursorPosition();
  };

  const onKeyUp = () => {
    $startCursorBlink();
  };

  let removeOnKeyDown: () => void;
  let removeOnKeyUp: () => void;

  $container.on(DisplayObjectEvent.CONTEXT_ENTER, () => {
    removeOnKeyDown = global.events.on(Event.KEY_DOWN, onKeyDown, $textSprite);
    removeOnKeyUp = global.events.on(Event.KEY_UP, onKeyUp, $textSprite);

    //Move cursor to end
    $cursorIndex = $text.length;
    $cursor.setPositionX($textSprite.$getTextBounds().width + 1);

    calcCursorPosition();

    setEditable(props.editable ?? true);
    $startCursorBlink();

    if ($selectionVisible) $selectionComponent.setVisible(true);

    openKeyboard();
  });
  $container.on(DisplayObjectEvent.CONTEXT_LEAVE, () => {
    setEditable(false);

    removeOnKeyDown();
    removeOnKeyUp();

    $placeHolderTextSprite.setVisible($text.length === 0);

    $selectionComponent.setVisible(false);

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
  const setText = (text: string) => {
    $text = text;
    $textSprite.setText($text);
    $textSprite.$render();

    $cursorIndex = $text.length;
    calcCursorPosition();
    $renderSelection();
  };
  const clear = () => {
    $text = "";
    $cursorIndex = 0;
    $cursor.setPosition({ x: 0, y: 0 });

    setEditable($editable);

    $cursorTextSprite.setText("");
    $textSprite.setText("");

    $placeHolderTextSprite.setVisible($text.length === 0);
  };

  autoFocus &&
    $container.on(DisplayObjectEvent.POINTER_TAP, () => $container.focus());

  {
    const { height } = $textSprite.$getCharacter("a");
    $cursor.setRectangle(1, height + 3);

    $renderSelection();
  }

  return $container.getComponent(inputTextSprite, {
    setEditable,
    getText,
    setText,
    clear,

    setColor: $textSprite.setTint,
    getColor: $textSprite.getColor,

    setSize: (size) => {
      $textSprite.setSize(size);
      $renderSelection();
    },
    getSize: $textSprite.getSize,

    setBackgroundColor: $textSprite.setBackgroundColor,
    getBackgroundColor: $textSprite.getBackgroundColor,

    setBackgroundAlpha: $textSprite.setBackgroundAlpha,
    getBackgroundAlpha: $textSprite.getBackgroundAlpha,

    setBackgroundPadding: (padding) => {
      $textSprite.setBackgroundPadding(padding);
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
