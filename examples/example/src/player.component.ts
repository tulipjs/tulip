import {
  animatedSprite,
  AsyncComponent,
  body,
  Container,
  Direction,
  DisplayObjectMutable,
  EventMode,
  graphics,
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

  const $player = await player2D({
    onTick,
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

  const $hitbox = graphics({
    color: 0xff0000,
    alpha: 0.1,
  });
  $hitbox.setTriangle(width, height);
  $player.add($hitbox);

  const $body = body({
    mass: 1,
  });

  $body.addShape({
    type: Shape.CONVEX,
    vertices: [
      [-width / 2, -height / 2], // top-left
      [width / 2, -height / 2], // top-right
      [0, height / 2], // bottom
    ],
  });
  $player.setBody($body);

  return $player.getComponent(playerComponent);
};
