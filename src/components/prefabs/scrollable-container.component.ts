import {
  ContainerComponent,
  DisplayObject,
  DisplayObjectMutable,
  PartialContainerProps,
  ScrollableMutable,
  ScrollableProps,
} from "../../types";
import { container, graphics } from "../core";
import {
  Cursor,
  DisplayObjectEvent,
  Event,
  EventMode,
  GraphicType,
} from "../../enums";
import { global } from "../../global";

export const scrollableContainer: ContainerComponent<
  ScrollableProps,
  ScrollableMutable
> = ({
  size,
  scrollY,
  scrollX,
  jump,
  scrollInterval = 250,
  components = [],
  ...$props
}) => {
  const $container = container<PartialContainerProps, ScrollableMutable>(
    $props,
  );
  $container.setSortableChildren(true);

  const $maskContainer = container({
    zIndex: 10,
  });
  $container.add($maskContainer);

  const mask = graphics({
    type: GraphicType.RECTANGLE,
    width: size.width,
    height: size.height,
  });
  $maskContainer.setMask(mask);

  const $content = container();
  $maskContainer.add($content);

  let moveScrollX: (increment: number) => void | null;
  let moveScrollY: (increment: number) => void | null;

  let actionCallback: (delta: number) => void;

  const setInternalSelectorAction = (
    displayObject: DisplayObjectMutable<DisplayObject>,
    jump: number,
    moveScroll: (num: number) => void,
  ) => {
    actionCallback = (delta) => {
      if (!displayObject.isCursorInside()) return (actionCallback = null);
      moveScroll(jump * delta * 2);
    };
  };

  if (scrollX) {
    const scrollXContainer = container({
      position: {
        x: 0,
        y: size.height,
      },
    });
    $container.add(scrollXContainer);
    const scrollButtonLeft = container({
      eventMode: EventMode.STATIC,
      cursor: Cursor.POINTER,
    });
    scrollButtonLeft.add(
      components.find(
        (component) => component.getMetadata() === "scroll-button-left",
      ) ??
        graphics({
          type: GraphicType.RECTANGLE,
          width: 5,
          height: 10,
          tint: 0xffff00,
        }),
    );
    const scrollButtonRight = container({
      eventMode: EventMode.STATIC,
      cursor: Cursor.POINTER,
      position: {
        x: size.width,
        y: 0,
      },
    });
    scrollButtonRight.add(
      components.find(
        (component) => component.getMetadata() === "scroll-button-right",
      ) ??
        graphics({
          type: GraphicType.RECTANGLE,
          width: 5,
          height: 10,
          tint: 0xffff00,
        }),
    );
    scrollButtonRight.setPositionX(
      size.width - scrollButtonRight.getBounds().width,
    );

    const scrollSelectorX = container({
      eventMode: EventMode.STATIC,
      cursor: Cursor.GRAB,
      position: {
        x: scrollButtonLeft.getBounds().width,
        y: 0,
      },
    });
    scrollSelectorX.add(
      components.find(
        (component) => component.getMetadata() === "scroll-selector-x",
      ) ??
        graphics({
          type: GraphicType.RECTANGLE,
          width: 10,
          height: 10,
          tint: 0x00ff00,
        }),
    );

    const scrollSelectorLeft = graphics({
      type: GraphicType.RECTANGLE,
      width: 0,
      height: 0,
      eventMode: EventMode.STATIC,
      cursor: Cursor.POINTER,
      tint: 0xff00ff,
      alpha: 0,
    });

    scrollSelectorLeft.on(DisplayObjectEvent.POINTER_DOWN, () => {
      setInternalSelectorAction(scrollSelectorLeft, -jump, moveScrollX);
    });

    const scrollSelectorRight = graphics({
      type: GraphicType.RECTANGLE,
      width: 0,
      height: 0,
      eventMode: EventMode.STATIC,
      cursor: Cursor.POINTER,
      tint: 0xff0000,
      alpha: 0,
    });
    scrollSelectorRight.on(DisplayObjectEvent.POINTER_DOWN, () => {
      setInternalSelectorAction(scrollSelectorRight, jump, moveScrollX);
    });
    moveScrollX = (increment: number = 1) => {
      const width = $content.getBounds().width - size.width;
      $content.setPivotX((x) => {
        if (increment === 0) return x;
        const targetX = x + increment;
        if (targetX >= width) return width;
        if (0 >= targetX) return 0;
        return targetX;
      });

      const percentage = $content.getPivot().x / width;
      scrollSelectorX.setPivotX(
        -(
          size.width -
          scrollButtonLeft.getBounds().width -
          scrollSelectorX.getBounds().width -
          scrollButtonRight.getBounds().width
        ) * percentage,
      );

      const maxHeight = Math.max(
        scrollButtonLeft.getBounds().height,
        scrollSelectorX.getBounds().height,
        scrollButtonRight.getBounds().height,
      );

      const middleScrollSelectorPosition =
        scrollButtonLeft.getBounds().height - scrollSelectorX.getPivot().x;
      scrollSelectorLeft.setRectangle(middleScrollSelectorPosition, maxHeight);
      scrollSelectorRight.setPositionX(middleScrollSelectorPosition);
      scrollSelectorRight.setRectangle(
        size.width - middleScrollSelectorPosition,
        maxHeight,
      );
    };
    moveScrollX(0);
    scrollButtonLeft.on(
      DisplayObjectEvent.POINTER_DOWN,
      () => (actionCallback = (delta) => moveScrollX(-jump * delta)),
    );
    scrollButtonRight.on(
      DisplayObjectEvent.POINTER_DOWN,
      () => (actionCallback = (delta) => moveScrollX(jump * delta)),
    );
    scrollXContainer.add(
      scrollSelectorRight,
      scrollSelectorLeft,
      scrollButtonLeft,
      scrollSelectorX,
      scrollButtonRight,
    );
  }
  if (scrollY) {
    const scrollYContainer = container({
      position: {
        x: size.width,
        y: 0,
      },
    });
    $container.add(scrollYContainer);
    const scrollButtonTop = container({
      eventMode: EventMode.STATIC,
      cursor: Cursor.POINTER,
    });
    scrollButtonTop.add(
      components.find(
        (component) => component.getMetadata() === "scroll-button-top",
      ) ??
        graphics({
          type: GraphicType.RECTANGLE,
          width: 10,
          height: 5,
          tint: 0xffff00,
        }),
    );
    const scrollButtonBottom = container({
      eventMode: EventMode.STATIC,
      cursor: Cursor.POINTER,
      position: {
        x: 0,
        y: size.height,
      },
    });
    scrollButtonBottom.add(
      components.find(
        (component) => component.getMetadata() === "scroll-button-bottom",
      ) ??
        graphics({
          type: GraphicType.RECTANGLE,
          width: 10,
          height: 5,
          tint: 0xffff00,
        }),
    );
    scrollButtonBottom.setPositionY(
      size.height - scrollButtonBottom.getBounds().height,
    );

    const scrollSelectorY = container({
      eventMode: EventMode.STATIC,
      cursor: Cursor.GRAB,
      position: {
        x: 0,
        y: scrollButtonTop.getBounds().height,
      },
    });
    scrollSelectorY.add(
      components.find(
        (component) => component.getMetadata() === "scroll-selector-y",
      ) ??
        graphics({
          type: GraphicType.RECTANGLE,
          width: 10,
          height: 10,
          tint: 0x00ff00,
        }),
    );

    const scrollSelectorTop = graphics({
      type: GraphicType.RECTANGLE,
      width: 0,
      height: 0,
      eventMode: EventMode.STATIC,
      cursor: Cursor.POINTER,
      tint: 0xff00ff,
      alpha: 0,
    });
    scrollSelectorTop.on(DisplayObjectEvent.POINTER_DOWN, () => {
      setInternalSelectorAction(scrollSelectorTop, -jump, moveScrollY);
    });

    const scrollSelectorBottom = graphics({
      type: GraphicType.RECTANGLE,
      width: 0,
      height: 0,
      eventMode: EventMode.STATIC,
      cursor: Cursor.POINTER,
      tint: 0xff0000,
      alpha: 0,
    });
    scrollSelectorBottom.on(DisplayObjectEvent.POINTER_DOWN, () => {
      setInternalSelectorAction(scrollSelectorBottom, jump, moveScrollY);
    });

    moveScrollY = (increment: number = 1) => {
      const height = $content.getBounds().height - size.height;
      $content.setPivotY((y) => {
        if (increment === 0) return y;
        const targetY = y + increment;
        if (targetY >= height) return height;
        if (0 >= targetY) return 0;
        return targetY;
      });

      const percentage = $content.getPivot().y / height;
      scrollSelectorY.setPivotY(
        -(
          size.height -
          scrollButtonTop.getBounds().height -
          scrollSelectorY.getBounds().height -
          scrollButtonBottom.getBounds().height
        ) * percentage,
      );
      const maxWidth = Math.max(
        scrollButtonTop.getBounds().width,
        scrollSelectorY.getBounds().width,
        scrollButtonBottom.getBounds().width,
      );

      const middleScrollSelectorPosition =
        scrollButtonTop.getBounds().height - scrollSelectorY.getPivot().y;
      scrollSelectorTop.setRectangle(maxWidth, middleScrollSelectorPosition);
      scrollSelectorBottom.setPositionY(middleScrollSelectorPosition);
      scrollSelectorBottom.setRectangle(
        maxWidth,
        size.height - middleScrollSelectorPosition,
      );
    };
    moveScrollY(0);
    scrollButtonTop.on(DisplayObjectEvent.POINTER_DOWN, () => {
      actionCallback = (delta) => moveScrollY(-jump * delta);
    });
    scrollButtonBottom.on(DisplayObjectEvent.POINTER_DOWN, () => {
      actionCallback = (delta) => moveScrollY(jump * delta);
    });

    scrollYContainer.add(
      scrollSelectorTop,
      scrollSelectorBottom,
      scrollButtonTop,
      scrollSelectorY,
      scrollButtonBottom,
    );
  }

  const add = (...displayObjects: DisplayObjectMutable<DisplayObject>[]) => {
    $content.add(...displayObjects);
  };
  const remove = (...displayObjects: DisplayObjectMutable<DisplayObject>[]) => {
    $content.remove(...displayObjects);
  };

  let removeOnWheel;
  let removeOnPointerUp;
  let removeOnTick;
  $container.on(DisplayObjectEvent.ADDED, () => {
    removeOnWheel = global.events.on(Event.WHEEL, (event: WheelEvent) => {
      const deltaX = (event.shiftKey ? event.deltaY : event.deltaX) / jump;
      const deltaY = (event.shiftKey ? 0 : event.deltaY) / jump;

      moveScrollX?.(deltaX);
      moveScrollY?.(deltaY);
    });
    removeOnPointerUp = global.events.on(Event.POINTER_UP, () => {
      // clearInterval(actionInterval);
      actionCallback = null;
    });
    removeOnTick = global.events.on(Event.TICK, ({ deltaTime }) => {
      // console.log(deltaTime);
      actionCallback?.(deltaTime);
    });
  });

  $container.on(DisplayObjectEvent.REMOVED, () => {
    removeOnTick();
    // clearInterval(actionInterval);
    removeOnWheel();
    removeOnPointerUp();
  });

  return $container.getComponent(scrollableContainer, {
    add,
    remove,
  });
};
