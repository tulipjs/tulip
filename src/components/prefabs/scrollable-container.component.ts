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
  EventMode,
  GraphicType,
} from "../../enums";

export const scrollableContainer: ContainerComponent<
  ScrollableProps,
  ScrollableMutable
> = ({ size, scrollY, scrollX, jump, components = [], ...$props }) => {
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
    const moveScrollX = () => {
      const percentage = $content.getPivot().x / getContentWidth();
      scrollSelectorX.setPivotX(
        -(
          size.width -
          scrollButtonLeft.getBounds().width -
          scrollSelectorX.getBounds().width -
          scrollButtonRight.getBounds().width
        ) * percentage,
      );
    };
    const getContentWidth = () => $content.getBounds().width - size.width;
    scrollButtonLeft.on(DisplayObjectEvent.POINTER_DOWN, () => {
      $content.setPivotX((x) => {
        const targetX = x - jump;
        return 0 >= targetX ? 0 : targetX;
      });
      moveScrollX();
    });
    scrollButtonRight.on(DisplayObjectEvent.POINTER_DOWN, () => {
      $content.setPivotX((x) => {
        const targetX = x + jump;
        const width = getContentWidth();
        return targetX >= width ? width : targetX;
      });
      moveScrollX();
    });
    scrollXContainer.add(scrollButtonLeft, scrollSelectorX, scrollButtonRight);
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
    const moveScrollY = () => {
      const percentage = $content.getPivot().y / getContentHeight();
      scrollSelectorY.setPivotY(
        -(
          size.height -
          scrollButtonTop.getBounds().height -
          scrollSelectorY.getBounds().height -
          scrollButtonBottom.getBounds().height
        ) * percentage,
      );
    };
    const getContentHeight = () => $content.getBounds().height - size.height;
    scrollButtonTop.on(DisplayObjectEvent.POINTER_DOWN, () => {
      $content.setPivotY((y) => {
        const targetY = y - jump;
        return 0 >= targetY ? 0 : targetY;
      });
      moveScrollY();
    });
    scrollButtonBottom.on(DisplayObjectEvent.POINTER_DOWN, () => {
      $content.setPivotY((y) => {
        const targetY = y + jump;
        const height = getContentHeight();
        return targetY >= height ? height : targetY;
      });
      moveScrollY();
    });
    scrollYContainer.add(scrollButtonTop, scrollSelectorY, scrollButtonBottom);
  }

  const add = (...displayObjects: DisplayObjectMutable<DisplayObject>[]) => {
    $content.add(...displayObjects);
  };
  const remove = (...displayObjects: DisplayObjectMutable<DisplayObject>[]) => {
    $content.remove(...displayObjects);
  };

  return $container.getComponent(scrollableContainer, {
    add,
    remove,
  });
};
