import {
  animatedSprite,
  AsyncComponent,
  body,
  Container,
  Direction,
  DisplayObjectMutable,
  EventMode,
  player2D,
  PlayStatus,
  Shape,
} from "@tulib/tulip";

type Props = {};

type Mutable = {} & DisplayObjectMutable<Container>;

export const playerComponent: AsyncComponent<Props, Mutable> = async () => {
  let $sprite;

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

  const $player = player2D({
    onTick,
    maxSpeed: 10,
    acceleration: 3,
  });

  const width = 175;
  const height = 226;

  $sprite = await animatedSprite({
    spriteSheet: "fighter/fighter.json",
    animation: "turnRight",
    eventMode: EventMode.NONE,
  });
  $sprite.setPivot({ x: width / 2, y: height / 2 });
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
  $player.setBody($body);

  return $player.getComponent(playerComponent);
};
