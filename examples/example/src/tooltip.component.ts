import {
  container,
  ContainerComponent,
  EventMode,
  graphics,
  GraphicType,
  textSprite,
} from "@tulib/tulip";

type Props = {
  tooltip: string;
};

export const tooltipComponent: ContainerComponent<Props> = ({
  tooltip,
}: Props) => {
  const $container = container({
    eventMode: EventMode.NONE,
    pivot: {
      x: -10,
      y: -10,
    },
  });
  const bg = graphics({
    type: GraphicType.RECTANGLE,
    width: 60,
    height: 7,
    tint: 0xff00ff,
  });

  const $defaultMinus = textSprite({
    spriteSheet: "fonts/default-font.json",
    text: tooltip,
  });
  $container.add(bg, $defaultMinus);

  return $container.getComponent(tooltipComponent);
};
