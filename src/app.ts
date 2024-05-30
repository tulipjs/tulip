import { AsyncComponent, Container } from "types";
import {
  containerComponent,
  ContainerMutable,
  spriteComponent,
} from "components";

type Mutable = {} & ContainerMutable;

export const app: AsyncComponent<Container, unknown, Mutable> = async () => {
  const [container, containerMutable] = containerComponent();

  const [sprite] = await spriteComponent({
    texture: "./assets/player.png",
    // texture: "https://pixijs.com/assets/bunny.png",
  });

  container.addChild(sprite);

  const mutable = {
    ...containerMutable,
  };

  return [container, mutable];
};
