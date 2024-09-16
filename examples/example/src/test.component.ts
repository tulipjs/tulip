import {
  container,
  DisplayObjectEvent,
  graphics,
  GraphicType,
  scrollableContainer,
  sprite,
} from "@tu/tulip";

export const testComponent = () => {
  const $container = container({
    sortableChildren: true,
    visible: true,
    label: "aha",
  });

  $container.on(DisplayObjectEvent.MOUNT, () => {
    console.log("> mount container");
    console.log(
      // $container.getFather(),
      $container.isInStage(),
    );
    console.log(scrollable.isInStage());
  });

  $container.on(DisplayObjectEvent.UNMOUNT, () => {
    console.log("< unmount container");
  });

  const scrollable = scrollableContainer({
    size: { width: 200, height: 150 },
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
  // $container.add(scrollable);

  scrollable.on(DisplayObjectEvent.MOUNT, () => {
    console.log("> mount scrollable");
    console.log(scrollable.isInStage());
  });

  scrollable.on(DisplayObjectEvent.UNMOUNT, () => {
    console.log("< unmount scrollable");
  });

  $container.add(scrollable);

  scrollable.add(
    sprite({
      spriteSheet: "fonts/default-font-bold.json",
      texture: "X",
      metadata: "scroll-selector-x",
      position: {
        x: 40,
        y: 60,
      },
    }),
  );

  setTimeout(() => {
    scrollable.add(
      graphics({
        type: GraphicType.POLYGON,
        polygon: [0, 0, 100, 200, 200, 200],
        tint: 0xff00ff,
      }),
    );
  }, 4_000);

  return $container.getComponent(testComponent);

  // const maskWidth = 100;
  // const maskHeight = 130;
  // const jump = 10;
  // const scrollHeight = 70;
  //
  // const $maskContainer = container({
  //   zIndex: 10,
  // });
  // $container.add($maskContainer);
  //
  // const mask = graphics({
  //   type: GraphicType.RECTANGLE,
  //   width: maskWidth,
  //   height: maskHeight,
  // });
  // $maskContainer.setMask(mask);
  //
  // const $contentContainer = container();
  // $maskContainer.add($contentContainer);
  //
  // const item1 = graphics({
  //   type: GraphicType.POLYGON,
  //   tint: 0xff0000,
  //   polygon: [0, 0, 100, 50, 100, 200, 100, 200],
  // });
  // $contentContainer.add(item1);
  //
  // const bg = graphics({
  //   type: GraphicType.RECTANGLE,
  //   width: maskWidth,
  //   height: maskHeight,
  //   tint: 0xff00ff,
  // });
  // $container.add(bg);
  //
  // const arrowBottom = graphics({
  //   type: GraphicType.CIRCLE,
  //   tint: 0x00ff00,
  //   radius: 10,
  //   position: {
  //     x: 120,
  //     y: 100,
  //   },
  //   cursor: Cursor.POINTER,
  //   eventMode: EventMode.STATIC,
  // });
  // const arrowSelectorContainer = container({
  //   position: {
  //     x: 110,
  //     y: 20,
  //   },
  // });
  // const arrowSelectorBg = graphics({
  //   type: GraphicType.RECTANGLE,
  //   tint: 0x0000ff,
  //   height: scrollHeight,
  //   width: 20,
  // });
  // const arrowSelector = graphics({
  //   type: GraphicType.RECTANGLE,
  //   tint: 0xffffff,
  //   height: 10,
  //   width: 20,
  // });
  // arrowSelectorContainer.add(arrowSelectorBg, arrowSelector);
  //
  // const arrowTop = graphics({
  //   type: GraphicType.CIRCLE,
  //   tint: 0x00ff00,
  //   radius: 10,
  //   position: {
  //     x: 120,
  //     y: 10,
  //   },
  //   cursor: Cursor.POINTER,
  //   eventMode: EventMode.STATIC,
  // });
  // const heightCorrection = $contentContainer.getBounds().height - maskHeight;
  // const moveScroll = () => {
  //   const percentageScroll = $contentContainer.getPivot().y / heightCorrection;
  //   arrowSelector.setPositionY(
  //     percentageScroll * (scrollHeight - arrowSelector.getBounds().height),
  //   );
  // };
  // arrowBottom.on(DisplayObjectEvent.POINTER_DOWN, () => {
  //   $contentContainer.setPivotY((y) => {
  //     const targetY = y + jump;
  //     const height = heightCorrection;
  //     return targetY >= height ? height : targetY;
  //   });
  //   moveScroll();
  // });
  // arrowTop.on(DisplayObjectEvent.POINTER_DOWN, () => {
  //   $contentContainer.setPivotY((y) => {
  //     const targetY = y - jump;
  //     return 0 >= targetY ? 0 : targetY;
  //   });
  //   moveScroll();
  // });
  // $container.add(arrowTop, arrowSelectorContainer, arrowBottom);
  //
  // return $container.getComponent(testComponent);
};
