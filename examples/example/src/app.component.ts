import {
  container,
  ContainerComponent,
  Cursor,
  DisplayObjectEvent,
  EventMode,
  global,
  graphics,
  GraphicType,
  HorizontalAlign,
  inputTextSprite,
  text,
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
      y: 22,
    },
    eventMode: EventMode.STATIC,
    // passwordChar: ".",
    cursor: Cursor.TEXT,
    backgroundAlpha: 1,
    backgroundColor: 0xff00ff,
    backgroundPadding: [3, 4, 2, 4],
    // defaultValue: "defaultValue",
    placeholder: "placeholder",
    size: {
      width: 90,
      height: 7,
    },
    // maxLength: 3,
    zIndex: 1000,
    horizontalAlign: HorizontalAlign.CENTER,
  });

  $input.on(DisplayObjectEvent.POINTER_TAP, () => {
    $input.focus();
  });
  global.context.onNoContext(() => {
    $player.focus();
  });
  $container.add($input);

  return $container.getComponent(appComponent);
};
