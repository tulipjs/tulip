import { Component, ContainerMutable, ContainerProps } from "../../types";
import { graphics, body, container } from "../index";
import { Shape } from "../../enums";

export const plane: Component<ContainerProps, ContainerMutable, false> = (
  props,
) => {
  const $container = container(props);

  const $body = body({ angle: props.angle });
  $body.addShape({
    type: Shape.PLANE,
  });

  $container.setBody($body);

  const $graphics = graphics({
    angle: props.angle,
    color: 0xff0000,
  });
  $graphics.setPolygon([0, 0, 10000, 0, 10000, 5, 0, 5]);
  $graphics.setPivot({ x: 5000, y: 2.5 });
  $container.add($graphics);

  return $container;
};
