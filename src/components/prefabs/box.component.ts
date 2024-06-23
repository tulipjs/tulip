import { body, container, graphics } from "../";
import { Shape } from "../../enums";
import { AsyncComponent, BoxProps, ContainerMutable } from "../../types";

export const box: AsyncComponent<BoxProps, ContainerMutable> = async (
  props,
) => {
  const $container = await container({
    ...props,
  });

  const {
    props: { color, width, height, mass, material },
  } = $container.getProps<BoxProps>();

  const $box = await graphics({
    color,
  });
  $box.setPolygon([0, 0, width, 0, width, height, 0, height]);
  await $box.setPivot({ x: width / 2, y: height / 2 });
  $container.add($box);

  const spriteBody = body({
    mass,
    material,
  });
  spriteBody.addShape({
    type: Shape.BOX,
    width,
    height,
  });

  await $container.setBody(spriteBody);

  return $container.getComponent(box);
};
