import { AsyncComponent, ContainerMutable, ContainerProps } from "../../types";
import { body, container, graphics } from "../core";
import { GraphicType, Shape } from "../../enums";

type PlaneProps = {
  props?: {
    color?: number;
  };
} & ContainerProps;

export const plane: AsyncComponent<
  PlaneProps,
  ContainerMutable,
  false
> = async ($props) => {
  const $container = await container($props);

  const $body = body({ angle: $props.angle });
  $body.addShape({
    type: Shape.PLANE,
  });

  await $container.setBody($body);

  const { props } = $container.getProps<PlaneProps>();

  const $graphics = await graphics({
    angle: $props.angle,
    color: props?.color === undefined ? 0xff00ff : props.color,
    polygon: [0, 0, 10000, 0, 10000, 5, 0, 5],
    type: GraphicType.POLYGON,
  });
  await $graphics.setPivot({ x: 5000, y: 2.5 });
  $container.add($graphics);

  return $container;
};
