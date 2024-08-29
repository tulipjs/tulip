import {
  ContainerComponent,
  ContainerMutable,
  DisplayObject,
  DisplayObjectMutable,
  DraggableMutable,
  DraggableProps,
  PartialContainerProps,
  Point,
  Size,
} from "../../types";
import { container } from "../core";
import { DisplayObjectEvent, Event } from "../../enums";
import { global } from "../../global";

export const draggableContainer: ContainerComponent<
  DraggableProps,
  DraggableMutable
> = ({ grabbingCursor, grabCursor, size, ...$props }) => {
  const $container = container<PartialContainerProps, DraggableMutable>($props);
  $container.setSortableChildren(true);

  let $size = size;

  let $wrapperContainerList: {
    container: ContainerMutable;
    draggableChildList: DisplayObjectMutable<DisplayObject>[];
    eventList: (() => void)[];
    grabbingList: boolean[];

    firstCursorPosition: Point;
    firstPosition: Point;
  }[] = [];

  let onRemoveCursorMove;

  $container.on(DisplayObjectEvent.ADDED, () => {
    onRemoveCursorMove = global.events.on(
      Event.CURSOR_MOVE,
      ({ position: cursorPosition }) => {
        for (const {
          container,
          grabbingList,
          firstPosition,
          firstCursorPosition,
        } of $wrapperContainerList) {
          if (!grabbingList.includes(true)) continue;

          const position = {
            x: firstPosition.x + cursorPosition.x - firstCursorPosition.x,
            y: firstPosition.y + cursorPosition.y - firstCursorPosition.y,
          };
          if (0 > position.x) {
            firstCursorPosition.x += position.x;
            position.x = 0;
          }
          if (0 > position.y) {
            firstCursorPosition.y += position.y;
            position.y = 0;
          }
          if ($size) {
            const bounds = container.getBounds();
            if (position.x + bounds.width > $size.width) {
              firstCursorPosition.x += position.x + bounds.width - $size.width;
              position.x = $size.width - bounds.width;
            }
            if (position.y + bounds.height > $size.height) {
              firstCursorPosition.y +=
                position.y + bounds.height - $size.height;
              position.y = $size.height - bounds.height;
            }
          }

          container.setPosition(position);
        }
      },
    );
  });
  $container.on(DisplayObjectEvent.REMOVED, () => {
    onRemoveCursorMove?.();

    for (const onRemoveEvent of $wrapperContainerList.flatMap(
      ({ eventList }) => eventList,
    ))
      onRemoveEvent();
  });

  const setSize = (size?: Size) => {
    $size = size;

    //check if container is out of bounds
    if (size) {
      for (const { container, firstCursorPosition } of $wrapperContainerList) {
        const bounds = container.getBounds();
        const position = container.getPosition();
        if (position.x + bounds.width > $size.width) {
          firstCursorPosition.x += position.x + bounds.width - $size.width;
          position.x = $size.width - bounds.width;
        }
        if (position.y + bounds.height > $size.height) {
          firstCursorPosition.y += position.y + bounds.height - $size.height;
          position.y = $size.height - bounds.height;
        }
        container.setPosition(position);
      }
    }
  };

  const $$add = $container.add;
  const add = (...displayObjects: DisplayObjectMutable<DisplayObject>[]) => {
    $$add(...displayObjects);

    for (const displayObject of displayObjects) {
      const container = displayObject as ContainerMutable;
      if (!container.getChildren) continue;

      let firstCursorPosition = { x: 0, y: 0 };
      let firstPosition = container.getPosition();
      let draggableChildList = [];
      let eventList = [];
      let grabbingList = [];

      $wrapperContainerList.push({
        container,
        firstCursorPosition,
        firstPosition,
        draggableChildList,
        eventList,
        grabbingList,
      });

      const loadDraggable = (
        ...displayObjectsMutable: DisplayObjectMutable<DisplayObject>[]
      ) => {
        for (const displayObject of displayObjectsMutable) {
          if (displayObject.getMetadata() !== "draggable") continue;

          draggableChildList.push(displayObject);
          grabbingList.push(false);
          grabCursor && displayObject.setCursor(grabCursor);

          const getIndex = () => draggableChildList.indexOf(displayObject);
          eventList.push([
            displayObject.on(
              DisplayObjectEvent.POINTER_DOWN,
              (event: PointerEvent) => {
                grabbingList[getIndex()] = true;
                const $containerPosition = container.getPosition();
                const scale = global.window.getScale();
                const $cursorPosition = global.normalizePoint({
                  x: event.clientX / scale,
                  y: event.clientY / scale,
                });

                firstPosition.x = $containerPosition.x;
                firstPosition.y = $containerPosition.y;

                firstCursorPosition.x = $cursorPosition.x;
                firstCursorPosition.y = $cursorPosition.y;

                for (const { container } of $wrapperContainerList)
                  container.setZIndex(0);
                container.setZIndex(10);

                grabbingCursor && displayObject.setCursor(grabbingCursor);
              },
            ),
            displayObject.on(DisplayObjectEvent.POINTER_UP, () => {
              grabbingList[getIndex()] = false;
              grabCursor && displayObject.setCursor(grabCursor);
            }),
            displayObject.on(DisplayObjectEvent.POINTER_UP_OUTSIDE, () => {
              grabbingList[getIndex()] = false;
              grabCursor && displayObject.setCursor(grabCursor);
            }),
          ]);
        }
      };

      loadDraggable(...container.getChildren());

      const $$add = container.add;
      container.add = (
        ...displayObjectsMutable: DisplayObjectMutable<DisplayObject>[]
      ) => {
        $$add(...displayObjectsMutable);
        loadDraggable(...displayObjectsMutable);
      };

      const $$remove = container.add;
      container.remove = (
        ...displayObjectsMutable: DisplayObjectMutable<DisplayObject>[]
      ) => {
        for (const displayObject of displayObjectsMutable) {
          $$remove(displayObject);

          const index = draggableChildList.indexOf(displayObject);
          if (index === -1) continue;

          for (const onRemoveEvent of eventList[index]) onRemoveEvent();

          draggableChildList = draggableChildList.filter(
            (_, $index) => index !== $index,
          );
          grabbingList = grabbingList.filter((_, $index) => index !== $index);
          eventList = eventList.filter((_, $index) => index !== $index);
        }
      };
    }
  };
  const $$remove = $container.remove;
  const remove = (...displayObjects: DisplayObjectMutable<DisplayObject>[]) => {
    $$remove(...displayObjects);

    for (const displayObject of displayObjects) {
      const container = displayObject as ContainerMutable;
      if (!container.getChildren) continue;

      $wrapperContainerList = $wrapperContainerList.filter(
        ($wrapper) => $wrapper.container.getId() !== container.getId(),
      );
    }
  };

  return $container.getComponent(draggableContainer, {
    add,
    remove,
    setSize,
  });
};
