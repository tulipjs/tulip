import {
  container,
  ContainerComponent,
  DisplayObjectEvent,
  nineSliceSprite,
} from "@tulib/tulip";

export const testComponent: ContainerComponent = () => {
  const $container = container();

  const conA = container();
  conA.on(DisplayObjectEvent.VISIBILITY_CHANGE, ({ visible }) => {
    console.log("visible", visible);
  });

  const nineslice = nineSliceSprite({
    spriteSheet: "chat.json",
    texture: "bubble",
    // texture: "chat.png",
    leftWidth: 4,
    topHeight: 4,
    rightWidth: 3,
    bottomHeight: 3,
    width: 20,
    height: 20,
  });
  $container.add(nineslice);

  return $container.getComponent(testComponent);
};
