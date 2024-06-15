import { body, container, graphics } from "../";
import { Shape } from "../../enums";
import { CircleProps, Component, ContainerMutable } from "../../types";

export const circle: Component<CircleProps, ContainerMutable> = (props) => {
  const $container = container({
    ...props,
  });

  const {
    props: { color, size },
  } = $container.getProps<CircleProps>();

  const $circle = graphics({
    color,
  });
  $circle.setCircle(size);
  $container.add($circle);

  const spriteBody = body({ mass: 1 });
  spriteBody.addShape({
    type: Shape.CIRCLE,
    radius: size,
  });

  $container.setBody(spriteBody);

  return $container.getComponent(circle);
};
