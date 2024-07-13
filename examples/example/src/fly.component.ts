import {
  circle,
  ContainerComponent,
  DisplayObjectEvent,
  EventMode,
  global,
  graphics,
  GraphicType,
} from "@tulib/tulip";
import { GlobalData } from "types";

type Props = {
  color: number;
  size: number;
  mass: number;
};

type Mutable = {};

export const flyComponent: ContainerComponent<Props, Mutable> = async (
  props,
) => {
  const polygon = [0, 0, 20, 0, 20, 20];
  const $container = await circle({
    ...props,
    eventMode: EventMode.STATIC,
    material: {
      friction: 0.3,
      restitution: 2,
      surfaceVelocity: 200,
    },
    hitArea: polygon,
  });
  $container.on(DisplayObjectEvent.POINTER_TAP, () => {
    console.log("click hitArea");
  });

  const alpha = 0.25;
  const size = 15;
  const position = size - 2;

  const pol = await graphics({
    polygon,
    color: 0xff00ff,
    type: GraphicType.POLYGON,
  });

  const circle2 = await circle({
    size,
    color: global.getData<GlobalData>().ballColor,
    mass: 0,
    alpha,
    position: {
      x: position,
      y: position,
    },
  });

  const circle3 = await circle({
    size,
    color: global.getData<GlobalData>().ballColor,
    mass: 0,
    alpha,
    position: {
      x: -position,
      y: -position,
    },
  });

  $container.add(circle2, circle3, pol);

  return $container.getComponent(flyComponent);
};
