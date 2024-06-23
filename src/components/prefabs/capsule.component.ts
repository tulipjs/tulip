import { body, container, graphics } from "../";
import { Shape } from "../../enums";
import { AsyncComponent, CapsuleProps, ContainerMutable } from "../../types";

export const capsule: AsyncComponent<CapsuleProps, ContainerMutable> = async (
  props,
) => {
  const $container = await container({
    ...props,
  });

  const {
    props: { color, length, radius, mass, material },
  } = $container.getProps<CapsuleProps>();

  const $capsule = await graphics({
    color,
  });
  $capsule.setCapsule(length, radius);
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
