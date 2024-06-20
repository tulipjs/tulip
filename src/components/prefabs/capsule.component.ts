import { body, container, graphics } from "../";
import { Shape } from "../../enums";
import { CapsuleProps, Component, ContainerMutable } from "../../types";

export const capsule: Component<CapsuleProps, ContainerMutable> = (props) => {
  const $container = container({
    ...props,
  });

  const {
    props: { color, length, radius, mass, material },
  } = $container.getProps<CapsuleProps>();

  const $capsule = graphics({
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

  $container.setBody(spriteBody);

  return $container.getComponent(capsule);
};
