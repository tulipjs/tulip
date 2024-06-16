import {
  Container,
  DisplayObjectMutable,
  world,
  plane,
  AsyncComponent,
  global,
  container,
  sprite,
  EventMode,
} from "@tulib/tulip";
import { ballComponent } from "ball.component";
import { inventoryComponent } from "./inventory.component";

type Mutable = {} & DisplayObjectMutable<Container>;

export const appComponent: AsyncComponent<unknown, Mutable> = async () => {
  const $container = container({ label: "app" });
  const $world = world({
    position: { x: 0, y: 0 },
    gravity: { x: 0, y: -3 },
    label: "world",
  });

  const $plane = plane({
    position: {
      x: 0,
      y: 100,
    },
    angle: 45,
  });
  $world.add($plane);

  const $plane2 = plane({
    position: {
      x: 400,
      y: 200,
    },
    angle: -45,
  });
  $world.add($plane2);

  const $ball = ballComponent({
    label: `ball`,
    props: {
      color: 0x00ff00,
      size: 4,
    },
    position: {
      x: 300,
      y: 0,
    },
  });
  $world.add($ball);

  // let selectedBall;
  // for (let y = 0; y < 5; y++) {
  //   for (let x = 0; x < 20; x++) {
  //     const isFirst = x === 19 && y === 0;
  //
  //     const _ball = ballComponent({
  //       label: `ball${x * y}`,
  //       color: isFirst ? 0x00ff00 : 0xffffff,
  //       size: 4,
  //     });
  //
  //     _ball.setPosition({ x: x * 5 + 100, y: y * 5 });
  //
  //     if (isFirst) selectedBall = _ball;
  //
  //     _world.add(_ball);
  //   }
  // }
  //
  // let currentKeyList = [];
  // createTicker(selectedBall.getDisplayObject(), () => {
  //   const body = selectedBall.getBody();
  //
  //   if (currentKeyList.includes("d")) {
  //     body.addForceX(-20);
  //   } else if (currentKeyList.includes("a")) {
  //     body.addForceX(20);
  //   } else if (currentKeyList.includes("w")) {
  //     body.addForceY(20);
  //   } else if (currentKeyList.includes("s")) {
  //     body.addForceY(-20);
  //   }
  // });
  //
  // document.addEventListener("keydown", ({ key }) => {
  //   currentKeyList = [...new Set([...currentKeyList, key])];
  // });
  // document.addEventListener("keyup", ({ key }) => {
  //   currentKeyList = currentKeyList.filter((cKey) => cKey != key);
  // });

  global.setVolume(0.5);

  const $inv = inventoryComponent();
  const $sprite = await sprite({
    texture: "player.png",
    eventMode: EventMode.STATIC,
  });

  $container.add($sprite);

  $sprite.on("click", () => {
    $inv.equipHoe();
  });

  $container.add($world);

  return $container.getComponent(appComponent);
};
