import {
  animatedSprite,
  AnimatedSpriteMutable,
  body,
  ContainerComponent,
  Direction,
  EventMode,
  graphics,
  GraphicType,
  player2D,
  PlayStatus,
  Shape,
  text,
  textSprite,
} from "@tulib/tulip";

type Props = {};

type Mutable = {
  doSomething: () => void;
};

export const playerComponent: ContainerComponent<Props, Mutable> = async (
  props,
) => {
  let $sprite: AnimatedSpriteMutable;

  const onTick = (direction: Direction) => {
    switch (direction) {
      case Direction.RIGHT:
        $sprite.setAnimation("turnRight");
        $sprite.setPlayStatus(PlayStatus.PLAY_AND_STOP);
        return;
      case Direction.LEFT:
        $sprite.setAnimation("turnLeft");
        $sprite.setPlayStatus(PlayStatus.PLAY_AND_STOP);
        return;
    }

    $sprite.setFrame(0);
  };

  const $player = await player2D({
    ...props,
    onTick,
    maxSpeed: 10,
    acceleration: 3,
    withContext: true,
    focused: true,
    eventMode: EventMode.NONE,
  });

  const width = 175;
  const height = 226;

  $sprite = await animatedSprite({
    spriteSheet: "fighter/fighter.json",
    animation: "turnRight",
  });
  await $sprite.setPivot({ x: width / 2, y: height / 2 });
  $player.add($sprite);

  const $body = body({
    mass: 10,
  });

  $body.addShape({
    type: Shape.CONVEX,
    width,
    height,
    vertices: [
      [-width / 2, -height / 2],
      [width / 2, -height / 2],
      [0, height / 2],
    ],
  });

  await $player.setBody($body);

  const $name = await textSprite({
    text: "pagoru",
    color: 0xffffff,
    spriteSheet: "fonts/default-font.json",
    position: {
      x: -16,
      y: 0,
    },
    zIndex: 2,
  });

  const $name2 = await textSprite({
    text: "alqubo",
    color: 0xffffff,
    spriteSheet: "fonts/default-font.json",
    position: {
      x: -14,
      y: 10,
    },
    zIndex: 2,
  });

  const $tulip = await text({
    text: "🌷",
    color: 0xffffff,
    font: "pixel",
    size: 20,
    position: {
      x: -45,
      y: 45,
    },
    pivot: {
      x: 10,
      y: 10,
    },
    zIndex: 2,
  });

  const $box = await graphics({
    type: GraphicType.CIRCLE,
    radius: 15,
    color: 0xffffff,
    position: {
      x: -45,
      y: 45,
    },
  });

  $player.add($name, $name2, $tulip, $box);

  return $player.getComponent(playerComponent);
};
