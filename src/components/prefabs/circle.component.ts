import { body, container, graphics } from "../";
import { GraphicType, Shape } from "../../enums";
import {
  CircleProps,
  ContainerComponent,
  PartialContainerMutable,
} from "../../types";

export const circle: ContainerComponent<
  CircleProps,
  PartialContainerMutable
> = async (props) => {
  const $container = await container({
    ...props,
  });

  const {
    props: { color, size, mass, material },
  } = $container.getProps();

  const $circle = await graphics({
    color,
    type: GraphicType.CIRCLE,
    radius: size,
  });
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
