import {
  AsyncComponent,
  Container,
  container as containerComponent,
  DisplayObjectMutable,
  EventMode,
  sprite as spriteComponent,
} from "@darkaqua/tulip";

type Mutable = {} & DisplayObjectMutable<Container>;

export const app: AsyncComponent<unknown, Mutable> = async () => {
  const container = containerComponent();

  const sprite = await spriteComponent({
    texture: "player.png",
    // texture: "https://pixijs.com/assets/bunny.png",
    eventMode: EventMode.STATIC,
  });

  sprite.on("click", () => {
    console.log("click", sprite.getVisible());
    // spriteMutable.setVisible(false);
    sprite.setTexture("https://pixijs.com/assets/bunny.png");
    sprite.setAlpha(0.25);
  });

  setInterval(() => {
    sprite.setPositionY((y) => y + 2);
  }, 50);

  container.add(sprite);

  return container;
};
