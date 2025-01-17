import {
  container,
  DisplayObjectEvent,
  EventMode,
  graphics,
  GraphicType,
  scrollableContainer,
  sprite,
} from "@tulib/tulip";

export const testComponent = () => {
  const $container = container({
    sortableChildren: true,
    visible: true,
  });

  const scrollable = scrollableContainer({
    label: "1",
    size: { width: 100, height: 100 },
    verticalScroll: true,
    horizontalScroll: true,
    jump: 5,
    zIndex: 10,
    components: [
      sprite({
        spriteSheet: "fonts/default-font-bold.json",
        texture: "A",
        metadata: "scroll-button-top",
      }),
      sprite({
        spriteSheet: "fonts/default-font-bold.json",
        texture: "B",
        metadata: "scroll-button-bottom",
      }),
      sprite({
        spriteSheet: "fonts/default-font-bold.json",
        texture: "X",
        metadata: "scroll-selector-y",
      }),
      sprite({
        spriteSheet: "fonts/default-font-bold.json",
        texture: "A",
        metadata: "scroll-button-left",
      }),
      sprite({
        spriteSheet: "fonts/default-font-bold.json",
        texture: "B",
        metadata: "scroll-button-right",
      }),
      sprite({
        spriteSheet: "fonts/default-font-bold.json",
        texture: "X",
        metadata: "scroll-selector-x",
      }),
    ],
  });
  $container.add(scrollable);
  scrollable.add(
    graphics({
      type: GraphicType.POLYGON,
      polygon: [0, 0, 100, 200, 200, 200],
      tint: 0xff00ff,
    }),
  );

  const scrollable1 = scrollableContainer({
    label: "2",
    size: { width: 100, height: 50 },
    position: {
      x: 50,
      y: 50,
    },
    verticalScroll: true,
    horizontalScroll: true,
    jump: 5,
    components: [
      sprite({
        spriteSheet: "fonts/default-font-bold.json",
        texture: "A",
        metadata: "scroll-button-top",
      }),
      sprite({
        spriteSheet: "fonts/default-font-bold.json",
        texture: "B",
        metadata: "scroll-button-bottom",
      }),
      sprite({
        spriteSheet: "fonts/default-font-bold.json",
        texture: "X",
        metadata: "scroll-selector-y",
      }),
      sprite({
        spriteSheet: "fonts/default-font-bold.json",
        texture: "A",
        metadata: "scroll-button-left",
      }),
      sprite({
        spriteSheet: "fonts/default-font-bold.json",
        texture: "B",
        metadata: "scroll-button-right",
      }),
      sprite({
        spriteSheet: "fonts/default-font-bold.json",
        texture: "X",
        metadata: "scroll-selector-x",
      }),
    ],
  });
  $container.add(scrollable1);
  const grap = graphics({
    type: GraphicType.POLYGON,
    polygon: [200, 200, 200, 50, 0, 0],
    tint: 0x00ff00,
    eventMode: EventMode.STATIC,
    hitArea: [200, 200, 200, 50, 0, 0],
  });
  grap.on(DisplayObjectEvent.POINTER_DOWN, () => {
    console.log("CLICK");
  });
  scrollable1.add(grap);

  return $container.getComponent(testComponent);
};
