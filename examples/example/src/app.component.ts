import {
  container,
  ContainerComponent,
  Cursor,
  DisplayObjectEvent,
  EventMode,
  global,
  graphics,
  GraphicType,
  inputTextSprite,
  plane,
  sliceSprite,
  sprite,
  text,
  textSprite,
  world,
} from "@tulib/tulip";
import { flyComponent } from "fly.component";
import { playerComponent } from "player.component";

type Props = {};
type Mutable = {};

export const appComponent: ContainerComponent<Props, Mutable> = async () => {
  global.$setVisualHitBoxes(false);

  const $container = await container({ label: "app" });

  const pixel = await graphics({
    type: GraphicType.POLYGON,
    polygon: [0, 0, 1, 0, 1, 1, 0, 1],
    color: 0xff00ff,
  });
  await pixel.setPosition({ x: 10, y: 10 });
  $container.add(pixel);

  const $c = await container({ label: "test" });

  const $world = await world({
    position: { x: 0, y: 0 },
    label: "world2",
    physics: {
      enabled: true,
      gravity: { x: 0, y: -0.0 },
    },
  });

  const $plane = await plane({
    position: {
      x: 0,
      y: 1200,
    },
    props: {
      color: 0xff3333,
    },
    alpha: 0.25,
  });

  for (let i = 0; i < 2; i++) {
    const _fly = await flyComponent({
      label: `ball`,
      color: 0xffffff,
      size: 2,
      mass: 0.1,
      position: {
        x: Math.random() * 1300,
        y: Math.random() * 900,
      },
    });
    $c.add(_fly);
  }

  const $player = await playerComponent();
  await $player.setPosition({ x: 200, y: 200 });

  // setInterval(() => {
  //   $player.doSomething();
  // }, 50);

  $world.add($player, $plane);
  $world.add($c);
  $container.add($world);

  const $text2 = await text({
    text: `🌷 tulip 🌷`,
    font: "Pixel",
    color: 0xeb34a8,
    size: 50,
    position: {
      x: 900,
      y: 1200,
    },
  });

  await $text2.setPivot({ x: 0, y: 50 });
  $text2.setSkew({ x: 0.2, y: 0 });

  $container.add($text2);

  const $pixelPerfectText = await textSprite({
    text: "ab c$ABC;123",
    spriteSheet: "fonts/default-font.json",
    color: 0xff0000,
    alpha: 0.75,
  });

  setTimeout(() => {
    $pixelPerfectText.setColor(0x00ff00);
  }, 500);
  setTimeout(() => {
    $pixelPerfectText.setText("hallo...");
  }, 1_000);
  $container.add($pixelPerfectText);

  // const $inputBackground = await graphics({
  //   type: GraphicType.RECTANGLE,
  //   width: 60,
  //   height: 10,
  //   color: 0x333333,
  //   eventMode: EventMode.STATIC,
  //   cursor: Cursor.TEXT,
  // });

  const $input = await inputTextSprite({
    spriteSheet: "fonts/default-font.json",
    color: 0xffffff,
    editable: true,
    withContext: true,
    position: {
      x: 10,
      y: 40,
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
    maxLength: 3,
  });

  $input.on(DisplayObjectEvent.POINTER_TAP, () => {
    $input.focus();
  });
  global.context.onNoContext(() => {
    $player.focus();
  });
  $container.add($input);

  const $spriteFromSpriteSheet = await sprite({
    spriteSheet: "fighter/fighter.json",
    texture: "rollSequence0014.png",
    eventMode: EventMode.NONE,
  });
  $container.add($spriteFromSpriteSheet);

  setTimeout(() => {
    $spriteFromSpriteSheet.setTexture("rollSequence0018.png");
  }, 2_000);

  const $sprite = await sliceSprite({
    texture: "chat.png",
    eventMode: EventMode.STATIC,
    cursor: Cursor.TEXT,
    position: {
      x: 200,
      y: 20,
    },
    leftWidth: 3,
    topHeight: 3,
    rightWidth: 3,
    bottomHeight: 3,
    width: 100,
    height: 9,
  });
  $container.add($sprite);

  return $container.getComponent(appComponent);
};
