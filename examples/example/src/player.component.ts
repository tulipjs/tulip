import {
  AsyncComponent,
  body,
  Container,
  Direction,
  DisplayObjectMutable,
  graphics,
  player,
  Shape,
} from "@tulib/tulip";

type Props = {};

type Mutable = {} & DisplayObjectMutable<Container>;

export const playerComponent: AsyncComponent<Props, Mutable> = async () => {
  let $sprite;

  const render = async ($container) => {
    const width = 100;
    const height = 100;
    $container.setPivot(width / 2, height / 2);

    const $figure = graphics({
      color: 0xff0000,
    });

    $figure.setTriangle(width, height);
    const $body = body({
      mass: 1,
    });

    const _height = (Math.sqrt(3) / 2) * width;

    console.log([
      [width / 2, -_height / 2], // bottom-right
      [width / 2, _height / 2], // top
      [-width / 2, -_height / 2], // bottom-left
    ]);

    $body.addShape({
      type: Shape.CONVEX,
      vertices: [
        [width / 2, -_height / 2], // bottom-right
        [width / 2, _height / 2], // top
        [-width / 2, -_height / 2], // bottom-left
      ],
    });
    $container.setBody($body);
    $container.add($figure);

    /*const width = 175;
    const height = 226;
    $container.setPivot({ x: width / 2, y: height / 2 });
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
      type: Shape.CONVEX,
      vertices: [
        [width / 2, 0],
        [width, height],
        [-width / 2, 0],
      ],
    });

    const $triangle = graphics({
      color: 0xff0000,
      alpha: 0.25,
    });
    $triangle.setTriangle(175, 226);
    $container.add($triangle);
    $container.setBody($body);*/
  };

  const onMove = (direction: Direction) => {
    switch (direction) {
      case Direction.RIGHT:
        // $sprite.setAnimation("turnRight");
        // $sprite.setPlayStatus(PlayStatus.PLAY_AND_STOP);
        return;
      case Direction.LEFT:
        // $sprite.setAnimation("turnLeft");
        // $sprite.setPlayStatus(PlayStatus.PLAY_AND_STOP);
        return;
    }

    // $sprite.setFrame(0);
  };

  const $player = await player({
    render,
    onMove,
  });

  return $player.getComponent(playerComponent);
};
