import {
  AsyncComponent,
  Container,
  container,
  DisplayObjectMutable,
  global,
  plane,
  world,
  text,
} from "@tulib/tulip";
import { flyComponent } from "fly.component";
import { playerComponent } from "player.component";

type Mutable = {} & DisplayObjectMutable<Container>;

export const appComponent: AsyncComponent<unknown, Mutable> = async () => {
  global.$setVisualHitBoxes(false);

  const $container = await container({ label: "app" });
  const $c = await container({ label: "test" });

  const $world = await world({
    position: { x: 0, y: 0 },
    label: "world2",
    props: {
      physics: {
        enabled: true,
        gravity: { x: 0, y: -0 },
      },
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

  for (let i = 0; i < 800; i++) {
    const _fly = await flyComponent({
      label: `ball`,
      props: {
        color: 0xffffff,
        size: 2,
        mass: 0.1,
      },
      position: {
        x: Math.random() * 1300,
        y: Math.random() * 900,
      },
    });
    $c.add(_fly);
  }

  const $player = await playerComponent();
  await $player.setPosition({ x: 500, y: 1000 });

  // setInterval(() => {
  //   $player.doSomething();
  // }, 50);

  $world.add($player, $plane);
  $world.add($c);
  $container.add($world);

  const $text = await text({
    text: `${Math.round(global.getFPS())} fps`,
    font: {
      src: "fonts/lineal.otf",
      alias: "Lineal",
    },
    color: 0xffff00,
    position: {
      x: 10,
      y: 10,
    },
  });

  setInterval(() => {
    $text.setText(`${Math.round(global.getFPS())} fps`);
  }, 1000);

  $container.add($text);

  const $text2 = await text({
    text: `Holi`,
    font: {
      src: "fonts/lineal.otf",
      alias: "Lineal",
    },
    color: 0xffff00,
    position: {
      x: 800,
      y: 500,
    },
  });

  $container.add($text2);

  return $container.getComponent(appComponent);
};
