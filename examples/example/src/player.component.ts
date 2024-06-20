import {
  animatedSprite,
  AsyncComponent,
  body,
  Container,
  Direction,
  DisplayObjectMutable,
  EventMode,
  player,
  PlayStatus,
  Shape,
} from "@tulib/tulip";

type Props = {};

type Mutable = {} & DisplayObjectMutable<Container>;

export const playerComponent: AsyncComponent<Props, Mutable> = async () => {
  let $sprite;

  const render = async ($container) => {
    $container.setPivot({ x: 175 / 2, y: 226 / 2 });
    $sprite = await animatedSprite({
      spriteSheet: "fighter/fighter.json",
      animation: "turnRight",
      eventMode: EventMode.NONE,
    });
    $container.add($sprite);

    const $body = body({
      mass: 1,
    });
    $body.addShape({
      type: Shape.CAPSULE,
      radius: 60,
      length: 20,
    });
    $container.setBody($body);
  };

  const onMove = (direction: Direction) => {
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

  const $player = await player({
    render,
    onMove,
  });

  return $player.getComponent(playerComponent);
};
