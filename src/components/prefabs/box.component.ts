import { body, container, graphics } from "../";
import { Shape } from "../../enums";
import { BoxProps, Component, ContainerMutable } from "../../types";

export const box: Component<BoxProps, ContainerMutable> = (props) => {
  const $container = container({
    ...props,
  });

  const {
    props: { color, width, height, mass, material },
  } = $container.getProps<BoxProps>();

  const $box = graphics({
    color,
  });
  $box.setPolygon([0, 0, width, 0, width, height, 0, height]);
  $box.setPivot({ x: width / 2, y: height / 2 });
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

  $container.setBody(spriteBody);

  return $container.getComponent(box);
};
