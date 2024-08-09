import {
  container,
  ContainerComponent,
  Cursor,
  DisplayObjectEvent,
  Event,
  EventMode,
  getOS,
  global,
  HorizontalAlign,
  inputTextSprite,
  OS,
  VerticalAlign,
} from "@tulib/tulip";

type Props = {};
type Mutable = {};

export const inputsComponent: ContainerComponent<Props, Mutable> = () => {
  const $container = container();

  const $input = inputTextSprite({
    label: "input-1",
    spriteSheet: "fonts/default-font.json",
    color: 0xffffff,
    editable: true,
    withContext: true,
    position: {
      x: 110,
      y: 10,
    },
    eventMode: EventMode.STATIC,
    // passwordChar: ".",
    cursor: Cursor.TEXT,
    backgroundAlpha: 1,
    backgroundColor: 0xff00ff,
    backgroundPadding: { top: 3, right: 4, bottom: 2, left: 4 },
    // defaultValue: "defaultValue",
    placeholder: `placeholder ${OS[getOS()]}`,
    size: {
      width: 90,
      height: 30,
    },
    // maxLength: 3,
    zIndex: 1000,
    horizontalAlign: HorizontalAlign.LEFT,
    verticalAlign: VerticalAlign.TOP,
    onTextChange: (preText, postText) => {
      return !preText.includes("abc");
    },
    selectionColor: 0xffffff,
    selectionGap: 4,
    selectionPadding: 2,
    withMask: true,
    accentYCorrection: -2,
  });
  global.events.on(Event.KEY_DOWN, ({ key }) => {
    if (key === "Enter" && $input.isFocused()) {
      $input.clear();
    }
  });
  $input.on(DisplayObjectEvent.CONTEXT_FORWARD, () => {
    global.context.focus($input2);
  });

  global.context.focus($input);

  const $input2 = inputTextSprite({
    label: "input-2",
    spriteSheet: "fonts/default-font.json",
    color: 0xffffff,
    editable: true,
    withContext: true,
    position: {
      x: 110,
      y: 55,
    },
    eventMode: EventMode.STATIC,
    // passwordChar: ".",
    cursor: Cursor.TEXT,
    backgroundAlpha: 1,
    backgroundColor: 0xff00ff,
    backgroundPadding: { top: 3, right: 4, bottom: 2, left: 4 },
    // defaultValue: "defaultValue",
    placeholder: `placeholder ${OS[getOS()]}`,
    size: {
      width: 90,
      height: 30,
    },
    // maxLength: 3,
    zIndex: 1000,
    horizontalAlign: HorizontalAlign.CENTER,
    verticalAlign: VerticalAlign.MIDDLE,
    onTextChange: (preText, postText) => {
      return !preText.includes("abc");
    },
    selectionColor: 0xffffff,
    selectionGap: 4,
    selectionPadding: 2,
    withMask: true,
    accentYCorrection: -2,
  });
  $input2.on(DisplayObjectEvent.CONTEXT_BACKWARD, () => {
    global.context.focus($input);
  });
  $input2.on(DisplayObjectEvent.CONTEXT_FORWARD, () => {
    global.context.focus($input3);
  });

  const $input3 = inputTextSprite({
    label: "input-3",
    spriteSheet: "fonts/default-font-bold.json",
    color: 0xffffff,
    editable: true,
    withContext: true,
    position: {
      x: 110,
      y: 100,
    },
    eventMode: EventMode.STATIC,
    // passwordChar: ".",
    cursor: Cursor.TEXT,
    backgroundAlpha: 1,
    backgroundColor: 0xff00ff,
    backgroundPadding: { top: 3, right: 4, bottom: 2, left: 4 },
    // defaultValue: "defaultValue",
    placeholder: `placeholder ${OS[getOS()]}`,
    size: {
      width: 90,
      height: 30,
    },
    // maxLength: 3,
    zIndex: 1000,
    horizontalAlign: HorizontalAlign.RIGHT,
    verticalAlign: VerticalAlign.BOTTOM,
    onTextChange: (preText, postText) => {
      return !preText.includes("abc");
    },
    selectionColor: 0xffffff,
    selectionGap: 4,
    selectionPadding: 2,
    withMask: true,
    accentYCorrection: -2,
  });
  $input3.on(DisplayObjectEvent.CONTEXT_BACKWARD, () => {
    global.context.focus($input2);
  });

  setTimeout(() => {
    $input3.setSize({ width: 200, height: 20 });
  }, 1_000);

  $container.add($input, $input2, $input3);

  return $container.getComponent(inputsComponent);
};
