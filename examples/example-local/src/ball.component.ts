import {
  Component,
  body,
  circleShape,
  container as containerComponent,
  Container,
  DisplayObjectMutable,
  EventMode,
  graphics as graphicsComponent,
} from "@darkaqua/tulip";

type Props = {
  label: string;
  color: number;
};

type Mutable = {} & DisplayObjectMutable<Container>;

export const ballComponent: Component<Props, Mutable> = ({ label, color }) => {
  const container = containerComponent({
    label,
    eventMode: EventMode.STATIC,
  });

  const circle = graphicsComponent({
    color,
  });
  circle.setCircle(4);
  container.add(circle);

  const spriteBody = body({ mass: 1 });
  spriteBody.addShape(circleShape({ radius: 3 }));

  container.setBody(spriteBody);

  return container.getComponent(ballComponent);
};
