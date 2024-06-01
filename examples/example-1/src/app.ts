import {
  AsyncComponent,
  Container,
  containerComponent,
  DisplayObjectMutable,
  EventMode,
  spriteComponent,
} from "@darkaqua/tulip";

type Mutable = {} & DisplayObjectMutable<Container>;

export const app: AsyncComponent<unknown, Mutable> = async () => {
  const containerMutable = containerComponent();

  const spriteMutable = await spriteComponent({
    texture: "player.png",
    // texture: "https://pixijs.com/assets/bunny.png",
    eventMode: EventMode.STATIC,
  });

  spriteMutable.on("click", () => {
    console.log("click", spriteMutable.getVisible());
    // spriteMutable.setVisible(false);
    spriteMutable.setTexture("https://pixijs.com/assets/bunny.png");
    spriteMutable.setAlpha(.25);
  });

  // setTimeout(() => {
  //   spriteMutable.setTexture("https://pixijs.com/assets/bunny.png");
  // }, 2_000);

  containerMutable.addChild(spriteMutable);

  return containerMutable;
};
