import {
  AsyncFunction,
  body,
  circleShape,
  container as containerComponent,
  Container,
  createTicker,
  DisplayObjectMutable,
  EventMode,
  sprite as spriteComponent,
} from "@darkaqua/tulip";

type Mutable = {} & DisplayObjectMutable<Container>;

export const player: AsyncFunction<unknown, Mutable> = async () => {
  const container = containerComponent({
    label: "player",
    eventMode: EventMode.STATIC,
    pivot: {
      x: 10,
      y: 10,
    },
  });

  const sprite = await spriteComponent({
    texture: "player.png",
  });
  container.add(sprite);

  container.on("click", () => {
    console.log("click", sprite.getVisible());
    // spriteMutable.setVisible(false);
    sprite.setTexture("https://pixijs.com/assets/bunny.png");
    sprite.setAlpha(0.25);
  });

  const spriteBody = body({ mass: 1 });
  spriteBody.addShape(circleShape({ radius: 1 }));

  container.setBody(spriteBody);

  let currentKey;
  createTicker(container.getDisplayObject(), () => {
    switch (currentKey) {
      case "d":
        spriteBody.addForceX(-4);
        return;
      case "a":
        spriteBody.addForceX(4);
        return;
      case "w":
        spriteBody.addForceY(4);
        return;
      case "s":
        spriteBody.addForceY(-4);
        return;
    }
  });

  document.addEventListener("keydown", ({ key }) => {
    currentKey = key;
  });
  document.addEventListener("keyup", ({ key }) => {
    currentKey = null;
  });

  return container;
};
