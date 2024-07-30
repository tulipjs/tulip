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
> = (props) => {
  const $container = container<CircleProps, PartialContainerMutable>(props);

  const { tint, size, mass, material } = $container.getProps();

  const $circle = graphics({
    tint,
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

  $container.setBody(spriteBody);

  return $container.getComponent(circle);
};
