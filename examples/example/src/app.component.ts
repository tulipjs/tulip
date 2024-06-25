import {
  AsyncComponent,
  Container,
  container,
  DisplayObjectMutable,
  global,
  plane,
  world,
} from "@tulib/tulip";
import { flyComponent } from "fly.component";
import { playerComponent } from "player.component";

type Mutable = {} & DisplayObjectMutable<Container>;

export const appComponent: AsyncComponent<unknown, Mutable> = async () => {
  global.$setVisualHitBoxes(true);

  const $container = await container({ label: "app" });

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

  for (let i = 0; i < 300; i++) {
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
    $world.add(_fly);
  }

  const $player = await playerComponent();
  await $player.setPosition({ x: 500, y: 1000 });

  setInterval(() => {
    $player.doSomething();
  }, 50);

  $world.add($player, $plane);
  $container.add($world);

  return $container.getComponent(appComponent);
};
