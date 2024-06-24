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
    ...props,
    eventMode: EventMode.STATIC,
    props: {
      ...props.props,
      material: {
        friction: 0.3,
        restitution: 2,
        surfaceVelocity: 200,
      },
    },
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

  container.add(circle2, circle3);

  return container.getComponent(flyComponent);
};
