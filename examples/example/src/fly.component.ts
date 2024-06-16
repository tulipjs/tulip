import {
  Component,
  Container,
  DisplayObjectMutable,
  EventMode,
  ContainerProps,
  global,
  circle,
} from "@tulib/tulip";
import { GlobalData } from "types";

type Props = {
  props: {
    color: number;
    size: number;
    mass: number;
  };
} & ContainerProps;

type Mutable = {} & DisplayObjectMutable<Container>;

export const flyComponent: Component<Props, Mutable> = (props) => {
  const container = circle({
    eventMode: EventMode.STATIC,
    ...props,
  });

  const alpha = 0.25;
  const size = 15;
  const position = size - 2;

  const circle2 = circle({
    props: {
      size,
      color: global.getData<GlobalData>().ballColor,
      mass: 0,
    },
    alpha,
    position: {
      x: position,
      y: position,
    },
  });
  container.add(circle2);

  const circle3 = circle({
    props: {
      size,
      color: global.getData<GlobalData>().ballColor,
      mass: 0,
    },
    alpha,
    position: {
      x: -position,
      y: -position,
    },
  });
  container.add(circle3);

  return container.getComponent(flyComponent);
};
