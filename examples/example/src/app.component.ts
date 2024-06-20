import {
  AsyncComponent,
  Container,
  container,
  DisplayObjectMutable,
  world,
} from "@tulib/tulip";
import { flyComponent } from "fly.component";
import { playerComponent } from "player.component";

type Mutable = {} & DisplayObjectMutable<Container>;

export const appComponent: AsyncComponent<unknown, Mutable> = async () => {
  const $container = container({ label: "app" });

  const $world = world({
    position: { x: 0, y: 0 },
    label: "world2",
    props: {
      physics: {
        enabled: true,
        gravity: { x: 0, y: -0 },
      },
    },
  });

  for (let i = 0; i < 1000; i++) {
    const _fly = flyComponent({
      label: `ball`,
      props: {
        color: 0xffffff,
        size: 4,
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
  $player.setPosition({ x: 500, y: 1000 });
  $world.add($player);
  $container.add($world);

  return $container.getComponent(appComponent);
};
