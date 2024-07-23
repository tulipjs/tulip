import { ContainerComponent, PartialContainerMutable } from "../../types";
import { container, graphics } from "../core";
import { GraphicType, Shape } from "../../enums";
import { body } from "../sub";

type PlaneProps = {};

export const plane: ContainerComponent<
  PlaneProps,
  PartialContainerMutable
> = async ($props) => {
  const $container = await container<PlaneProps, PartialContainerMutable>(
    $props,
  );

  const $body = body({ angle: $props.angle });
  $body.addShape({
    type: Shape.PLANE,
  });

  await $container.setBody($body);

  const $graphics = await graphics({
    angle: $props.angle,
    tint: $props?.tint === undefined ? 0xff00ff : $props.tint,
    polygon: [0, 0, 10000, 0, 10000, 5, 0, 5],
    type: GraphicType.POLYGON,
  });
  await $graphics.setPivot({ x: 5000, y: 2.5 });
  $container.add($graphics);

  return $container.getComponent(plane);
};
