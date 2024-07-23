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
> = async (props) => {
  const $container = await container<CapsuleProps, PartialContainerMutable>(
    props,
  );

  const { tint, length, radius, mass, material } = $container.getProps();

  const $capsule = await graphics({
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

  await $container.setBody(spriteBody);

  return $container.getComponent(capsule);
};
