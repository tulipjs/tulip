import {
  Container,
  container as containerComponent,
  sprite as spriteComponent,
  DisplayObjectMutable,
  EventMode,
  AsyncFunction,
  body,
  circleShape,
  world,
} from "@darkaqua/tulip";

type Mutable = {} & DisplayObjectMutable<Container>;

export const app: AsyncFunction<unknown, Mutable> = async () => {
  const container = containerComponent();

  const sprite = await spriteComponent({
    texture: "player.png",
    // texture: "https://pixijs.com/assets/bunny.png",
    eventMode: EventMode.STATIC,
  });

  const _world = world();

  const _body = body({});
  _body.addShape(circleShape({ radius: 10 }));
  sprite.setBody(_body);

  _world.add(sprite);

  sprite.on("click", () => {
    console.log("click", sprite.getVisible());
    // spriteMutable.setVisible(false);
    sprite.setTexture("https://pixijs.com/assets/bunny.png");
    sprite.setAlpha(0.25);
  });

  setInterval(() => {
    _world._step();
    console.log(sprite.getPosition());
  }, 1);

  container.add(sprite);

  return container;
};
