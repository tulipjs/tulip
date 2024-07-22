import {
  container,
  ContainerComponent,
  Cursor,
  EventMode,
  getOS,
  global,
  graphics,
  GraphicType,
  HorizontalAlign,
  inputTextSprite,
  OS,
  text,
  VerticalAlign,
  world,
} from "@tulib/tulip";
import { playerComponent } from "player.component";

type Props = {};
type Mutable = {};

export const appComponent: ContainerComponent<Props, Mutable> = async () => {
  const $container = await container({ label: "app" });

  const pixel = await graphics({
    type: GraphicType.POLYGON,
    polygon: [0, 0, 1, 0, 1, 1, 0, 1],
    color: 0xff00ff,
  });
  await pixel.setPosition({ x: 10, y: 10 });
  $container.add(pixel);

  const $world = await world({
    position: { x: 0, y: 0 },
    label: "world2",
    physics: {
      enabled: true,
      gravity: { x: 0, y: -0.0 },
    },
  });

  const $player = await playerComponent();
  await $player.setPosition({ x: 200, y: 200 });

  $world.add($player);
  $container.add($world);

  const $text2 = await text({
    text: `🌷 tulip 🌷`,
    font: "Pixel",
    color: 0xeb34a8,
    size: 20,
    position: {
      x: 15,
      y: 90,
    },
  });

  await $text2.setPivot({ x: 0, y: 50 });
  $text2.setSkew({ x: 0.2, y: 0 });

  $container.add($text2);

  const $input = await inputTextSprite({
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
  });

  const $input2 = await inputTextSprite({
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
  });

  const $input3 = await inputTextSprite({
    spriteSheet: "fonts/default-font.json",
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
  });

  global.context.onNoContext(() => {
    $player.focus();
  });
  $container.add($input, $input2, $input3);

  return $container.getComponent(appComponent);
};
