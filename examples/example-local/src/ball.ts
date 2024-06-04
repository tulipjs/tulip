import {
  Function,
  body,
  circleShape,
  container as containerComponent,
  Container,
  DisplayObjectMutable,
  EventMode,
  graphics,
} from "@darkaqua/tulip";

type Props = {
  label: string;
  color: number;
};

type Mutable = {} & DisplayObjectMutable<Container>;

export const ball: Function<Props, Mutable> = ({ label, color }) => {
  const container = containerComponent({
    label,
    eventMode: EventMode.STATIC,
  });

  const circle = graphics({
    color,
  });
  circle.setCircle(3);
  container.add(circle);

  const spriteBody = body({ mass: 1 });
  spriteBody.addShape(circleShape({ radius: 3 }));

  container.setBody(spriteBody);

  return container;
};
