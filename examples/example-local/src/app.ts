import {
  Container,
  container as containerComponent,
  DisplayObjectMutable,
  AsyncFunction,
  world,
  plane,
  createTicker,
} from "@darkaqua/tulip";
import { ball } from "./ball";

type Mutable = {} & DisplayObjectMutable<Container>;

export const app: AsyncFunction<unknown, Mutable> = async () => {
  const container = containerComponent({
    label: "app",
  });

  const _world = world({
    position: { x: 0, y: 0 },
    gravity: { x: 0, y: -9.5 },
    label: "world",
  });
  container.add(_world);

  const _plane = plane({
    position: {
      x: 0,
      y: 100,
    },
    angle: 45,
  });
  _world.add(_plane);

  const _plane2 = plane({
    position: {
      x: 400,
      y: 100,
    },
    angle: -45,
  });
  _world.add(_plane2);

  let selectedBall;
  for (let y = 0; y < 30; y++) {
    for (let x = 0; x < 20; x++) {
      const isFirst = x === 19 && y === 0;

      const _ball = ball({
        label: `ball${x * y}`,
        color: isFirst ? 0x00ff00 : 0xffffff,
      });

      _ball.setPosition({ x: x * 5 + 100, y: y * 5 });

      if (isFirst) selectedBall = _ball;

      _world.add(_ball);
    }
  }

  let currentKeyList = [];
  createTicker(selectedBall.getDisplayObject(), () => {
    const body = selectedBall.getBody();
    console.log(selectedBall.getBody().getPosition());

    console.log(currentKeyList);
    if (currentKeyList.includes("d")) {
      body.addForceX(-20);
    } else if (currentKeyList.includes("a")) {
      body.addForceX(20);
    } else if (currentKeyList.includes("w")) {
      body.addForceY(20);
    } else if (currentKeyList.includes("s")) {
      body.addForceY(-20);
    }
  });

  document.addEventListener("keydown", ({ key }) => {
    currentKeyList = [...new Set([...currentKeyList, key])];
  });
  document.addEventListener("keyup", ({ key }) => {
    currentKeyList = currentKeyList.filter((cKey) => cKey != key);
  });

  return container;
};
