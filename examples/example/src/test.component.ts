import {
  container,
  ContainerComponent,
  DisplayObjectEvent,
  EventMode,
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
    width: 200,
    height: 200,
    tooltip: "test",
    eventMode: EventMode.STATIC,
  });
  const nineslice1 = nineSliceSprite({
    spriteSheet: "chat.json",
    texture: "bubble",
    // texture: "chat.png",
    leftWidth: 4,
    topHeight: 4,
    rightWidth: 3,
    bottomHeight: 3,
    width: 200,
    height: 200,
    tooltip: "123abc",
    eventMode: EventMode.STATIC,
    position: {
      x: 220,
      y: 0,
    },
  });
  $container.add(nineslice, nineslice1);

  return $container.getComponent(testComponent);
};
