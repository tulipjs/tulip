import { body, container, graphics } from "../";
import { GraphicType, Shape } from "../../enums";
import {
  CapsuleProps,
  ContainerComponent,
  PartialContainerMutable,
} from "../../types";

export const capsule: ContainerComponent<
  CapsuleProps,
  PartialContainerMutable
> = (props) => {
  const $container = container<CapsuleProps, PartialContainerMutable>(props);

  const { tint, length, radius, mass, material } = $container.getProps();

  const $capsule = graphics({
    tint,
    type: GraphicType.CAPSULE,
    radius,
    length,
  });
  $container.add($capsule);

  const spriteBody = body({
    mass,
    material,
  });
  spriteBody.addShape({
    type: Shape.CAPSULE,
    radius,
    length,
  });

  $container.setBody(spriteBody);

  return $container.getComponent(capsule);
};
