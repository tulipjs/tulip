import {
  Container,
  container as containerComponent,
  DisplayObjectMutable,
  AsyncFunction,
  world,
  plane,
} from "@darkaqua/tulip";
import { player } from "./player";

type Mutable = {} & DisplayObjectMutable<Container>;

export const app: AsyncFunction<unknown, Mutable> = async () => {
  const container = containerComponent({
    label: "app",
  });

  const _world = world({
    position: { x: 10, y: 10 },
    gravity: { x: 0, y: -0.5 },
    label: "world",
  });
  container.add(_world);

  const _plane = plane({
    position: {
      x: 0,
      y: 50,
    },
  });
  _world.add(_plane);

  const currentPlayer = await player();
  _world.add(currentPlayer);

  return container;
};
