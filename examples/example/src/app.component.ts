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

  const $inputContainer = await container({
    position: {
      x: 10,
      y: 80,
    },
  });
  $container.add($inputContainer);

  const $inputBackground = await graphics({
    type: GraphicType.POLYGON,
    polygon: [0, 0, 60, 0, 60, 10, 0, 10],
    color: 0x333333,
    eventMode: EventMode.STATIC,
    cursor: Cursor.TEXT,
  });

  const $input = await inputTextSprite({
    spriteSheet: "fonts/default-font.json",
    color: 0xffffff,
    editable: true,
    withContext: true,
    pivot: {
      x: -2,
      y: -2,
    },
    eventMode: EventMode.NONE,
  });

  $inputBackground.on(DisplayObjectEvent.POINTER_TAP, () => {
    $input.focus();
  });
  global.context.onNoContext(() => {
    $player.focus();
  });
  $inputContainer.add($inputBackground, $input);

  return $container.getComponent(appComponent);
};
