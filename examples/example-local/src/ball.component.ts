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
  };
} & ContainerProps;

type Mutable = {} & DisplayObjectMutable<Container>;

export const ballComponent: Component<Props, Mutable> = (props) => {
  const container = circle({
    eventMode: EventMode.STATIC,
    ...props,
  });

  const circle2 = circle({
    props: {
      size: 15,
      color: global.getData<GlobalData>().ballColor,
    },
    position: {
      x: 15,
      y: 15,
    },
  });
  container.add(circle2);

  return container.getComponent(ballComponent);
};
