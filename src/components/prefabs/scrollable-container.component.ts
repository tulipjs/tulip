import {
  ContainerComponent,
  ContainerMutable,
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
  verticalScroll,
  horizontalScroll,
  jump,
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

  let xScrollContainer: ContainerMutable;
  let yScrollContainer: ContainerMutable;

  const renderScroll = (axis: "x" | "y") => {
    const isX = axis === "x";
    const pivotFuncStr = isX ? "setPivotX" : "setPivotY";
    const positionFuncStr = isX ? "setPositionX" : "setPositionY";
    const sizeStr = isX ? "width" : "height";
    const reversedSizeStr = !isX ? "width" : "height";
    const posStr = isX ? "x" : "y";

    const scrollContainer = container({
      position: {
        x: isX ? 0 : size.width,
        y: isX ? size.height : 0,
      },
      visible: false,
    });
    $container.add(scrollContainer);

    isX
      ? (xScrollContainer = scrollContainer)
      : (yScrollContainer = scrollContainer);

    const initialScrollButton = container({
      eventMode: EventMode.STATIC,
      cursor: Cursor.POINTER,
    });
    initialScrollButton.add(
      components.find(
        (component) =>
          component.getMetadata() === `scroll-button-${isX ? "left" : "top"}`,
      ) ??
        graphics({
          type: GraphicType.RECTANGLE,
          width: 10,
          height: 10,
          tint: 0xffff00,
        }),
    );
    const finalScrollButton = container({
      eventMode: EventMode.STATIC,
      cursor: Cursor.POINTER,
      position: {
        x: isX ? size.width : 0,
        y: isX ? 0 : size.height,
      },
    });
    finalScrollButton.add(
      components.find(
        (component) =>
          component.getMetadata() ===
          `scroll-button-${isX ? "right" : "bottom"}`,
      ) ??
        graphics({
          type: GraphicType.RECTANGLE,
          width: 10,
          height: 10,
          tint: 0xffff00,
        }),
    );
    const initialScrollButtonBounds = initialScrollButton.getBounds();
    const finalScrollButtonBounds = finalScrollButton.getBounds();
    finalScrollButton.setPosition({
      x: isX ? size.width - finalScrollButtonBounds.width : 0,
      y: isX ? 0 : size.height - finalScrollButtonBounds.height,
    });
    const scrollSelector = container({
      eventMode: EventMode.STATIC,
      cursor: Cursor.GRAB,
      position: {
        x: isX ? initialScrollButtonBounds.width : 0,
        y: isX ? 0 : initialScrollButtonBounds.height,
      },
    });
    scrollSelector.add(
      components.find(
        (component) =>
          component.getMetadata() === `scroll-selector-${isX ? "x" : "y"}`,
      ) ??
        graphics({
          type: GraphicType.RECTANGLE,
          width: 10,
          height: 10,
          tint: 0x00ff00,
        }),
    );
    let isScrollSelectorSelected = false;
    let previous = 0;

    scrollSelector.on(DisplayObjectEvent.POINTER_DOWN, () => {
      isScrollSelectorSelected = true;
      previous = global.cursor.getPosition()[isX ? "x" : "y"];
      global.cursor.setCursor(Cursor.GRABBING);
    });
    scrollSelector.on(DisplayObjectEvent.POINTER_UP, () => {
      isScrollSelectorSelected = false;
      global.cursor.setCursor(Cursor.DEFAULT);
    });
    scrollSelector.on(DisplayObjectEvent.POINTER_UP_OUTSIDE, () => {
      isScrollSelectorSelected = false;
      global.cursor.setCursor(Cursor.DEFAULT);
    });
    scrollSelector.on(DisplayObjectEvent.GLOBAL_POINTER_MOVE, () => {
      if (!isScrollSelectorSelected) return;
      global.cursor.setCursor(Cursor.GRABBING);
      const current = global.cursor.getPosition()[isX ? "x" : "y"];
      const increment = previous - current;
      previous = current;
      moveScrollSelector(increment);
    });
    const calculateScrollBounds = () => {
      const maxSize = Math.max(
        initialScrollButton.getBounds()[reversedSizeStr],
        scrollSelector.getBounds()[reversedSizeStr],
        finalScrollButton.getBounds()[reversedSizeStr],
      );

      const middleScrollSelectorPosition =
        initialScrollButton.getBounds()[sizeStr] -
        scrollSelector.getPivot()[posStr] +
        scrollSelector.getBounds()[reversedSizeStr];

      initialScrollSelector.setRectangle(
        isX
          ? middleScrollSelectorPosition -
              scrollSelector.getBounds()[reversedSizeStr]
          : maxSize,
        isX
          ? maxSize
          : middleScrollSelectorPosition -
              scrollSelector.getBounds()[reversedSizeStr],
      );
      finalScrollSelector[positionFuncStr](middleScrollSelectorPosition);
      finalScrollSelector.setRectangle(
        isX ? size[sizeStr] - middleScrollSelectorPosition : maxSize,
        isX ? maxSize : size[sizeStr] - middleScrollSelectorPosition,
      );
    };
    const moveScrollSelector = (increment: number = 1) => {
      const scrollAreaSize =
        size[sizeStr] -
        initialScrollButton.getBounds()[sizeStr] -
        finalScrollButton.getBounds()[sizeStr];
      const selectorValue = scrollSelector.getBounds()[sizeStr];

      scrollSelector[pivotFuncStr]((value) => {
        if (increment === 0) return value;
        const targetValue = value + increment;

        if (targetValue >= 0) return 0;
        if (-targetValue >= scrollAreaSize - selectorValue)
          return -scrollAreaSize + selectorValue;

        return targetValue;
      });

      // Calculate percentage of selector's position to adjust content scrolling
      const percentage =
        scrollSelector.getPivot()[posStr] / (scrollAreaSize - selectorValue);

      // Move content based on the position of the scroll selector
      const contentHeight = $content.getBounds()[sizeStr] - size[sizeStr];
      $content[pivotFuncStr](-contentHeight * percentage);

      calculateScrollBounds();
    };

    const initialScrollSelector = graphics({
      type: GraphicType.RECTANGLE,
      width: 0,
      height: 0,
      eventMode: EventMode.STATIC,
      cursor: Cursor.POINTER,
      tint: 0xff00ff,
      alpha: 0,
    });
    initialScrollSelector.on(DisplayObjectEvent.POINTER_DOWN, () => {
      setInternalSelectorAction(initialScrollSelector, -jump, moveScroll);
    });
    const finalScrollSelector = graphics({
      type: GraphicType.RECTANGLE,
      width: 0,
      height: 0,
      eventMode: EventMode.STATIC,
      cursor: Cursor.POINTER,
      tint: 0xff0000,
      alpha: 0,
    });
    finalScrollSelector.on(DisplayObjectEvent.POINTER_DOWN, () => {
      setInternalSelectorAction(finalScrollSelector, jump, moveScroll);
    });

    const moveScrollFunction = (increment: number = 1) => {
      if (!scrollContainer.getVisible()) return;

      const $size = $content.getBounds()[sizeStr] - size[sizeStr];
      $content[pivotFuncStr]((value) => {
        if (increment === 0) return value;
        const targetValue = value + increment;
        if (targetValue >= $size) return $size;
        if (0 >= targetValue) return 0;
        return targetValue;
      });

      const percentage = $content.getPivot()[posStr] / $size;
      scrollSelector[pivotFuncStr](
        -(
          size[sizeStr] -
          initialScrollButton.getBounds()[sizeStr] -
          scrollSelector.getBounds()[sizeStr] -
          finalScrollButton.getBounds()[sizeStr]
        ) * percentage,
      );
      calculateScrollBounds();
    };
    isX
      ? (moveScrollX = moveScrollFunction)
      : (moveScrollY = moveScrollFunction);

    const moveScroll = isX ? moveScrollX : moveScrollY;

    moveScroll(0);
    initialScrollButton.on(DisplayObjectEvent.POINTER_DOWN, () => {
      actionCallback = (delta) => moveScroll(-jump * delta);
    });
    finalScrollButton.on(DisplayObjectEvent.POINTER_DOWN, () => {
      actionCallback = (delta) => moveScroll(jump * delta);
    });

    scrollContainer.add(
      initialScrollSelector,
      finalScrollSelector,
      initialScrollButton,
      scrollSelector,
      finalScrollButton,
    );
  };

  verticalScroll && renderScroll("y");
  horizontalScroll && renderScroll("x");

  const add = (...displayObjects: DisplayObjectMutable<DisplayObject>[]) => {
    $content.add(...displayObjects);

    const contentBounds = $content.getBounds();

    xScrollContainer?.setVisible(contentBounds.width > size.width);
    yScrollContainer?.setVisible(contentBounds.height > size.height);
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
      actionCallback = null;
    });
    removeOnTick = global.events.on(Event.TICK, ({ deltaTime }) => {
      actionCallback?.(deltaTime);
    });
  });

  $container.on(DisplayObjectEvent.REMOVED, () => {
    removeOnTick();
    removeOnWheel();
    removeOnPointerUp();
  });

  return $container.getComponent(scrollableContainer, {
    add,
    remove,
  });
};
