import {
  Component,
  body,
  circleShape,
  container as containerComponent,
  Container,
  DisplayObjectMutable,
  EventMode,
  graphics as graphicsComponent,
  ContainerProps,
} from "@darkaqua/tulip";

type Props = {
  props: {
    color: number;
    size: number;
  };
} & ContainerProps;

type Mutable = {} & DisplayObjectMutable<Container>;

export const ballComponent: Component<Props, Mutable> = (props) => {
  const container = containerComponent({
    eventMode: EventMode.STATIC,
    ...props,
  });

  const {
    props: { color, size },
  } = container.getProps<Props>();

  const circle = graphicsComponent({
    color,
  });
  circle.setCircle(size);
  container.add(circle);

  const circle2 = graphicsComponent({
    color: 0x00ff00,
    pivot: {
      x: 10,
      y: 10,
    },
  });
  circle2.setCircle(size + 7);
  container.add(circle2);

  const spriteBody = body({ mass: 1 });
  spriteBody.addShape(circleShape({ radius: size }));

  container.setBody(spriteBody);

  return container.getComponent(ballComponent);
};
