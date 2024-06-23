import { body, container, graphics } from "../";
import { Shape } from "../../enums";
import { AsyncComponent, CircleProps, ContainerMutable } from "../../types";

export const circle: AsyncComponent<CircleProps, ContainerMutable> = async (
  props,
) => {
  const $container = await container({
    ...props,
  });

  const {
    props: { color, size, mass, material },
  } = $container.getProps<CircleProps>();

  const $circle = await graphics({
    color,
  });
  $circle.setCircle(size);
  $container.add($circle);

  const spriteBody = body({
    mass,
    material,
  });
  spriteBody.addShape({
    type: Shape.CIRCLE,
    radius: size,
  });

  await $container.setBody(spriteBody);

  return $container.getComponent(circle);
};
