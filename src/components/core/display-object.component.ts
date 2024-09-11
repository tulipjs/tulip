import {
  ApplicationMutable,
  Container,
  ContainerMutable,
  DisplayObject as DO,
  DisplayObjectMutable,
  DisplayObjectProps,
  Point,
} from "../../types";
import { component } from "./component.component";
import { getValueMutableFunction, isNotNullish } from "../../utils";
import { Cursor, DisplayObjectEvent, Event, EventMode } from "../../enums";
import { global } from "../../global";
import * as PIXI from "pixi.js";

export const displayObject = <
  DisplayObject extends DO,
  Props = {},
  Mutable = {},
  Data = {},
>(
  {
    displayObject: $displayObject,
    ...originalProps
  }: DisplayObjectProps<Props, Data> = {} as DisplayObjectProps<Props, Data>,
): DisplayObjectMutable<DisplayObject, Props, Mutable, Data> => {
  const $component = component<DisplayObjectProps<Props, Data>>(
    originalProps as DisplayObjectProps<Props, Data>,
  );

  const { withContext, metadata, tooltip } = $component.getProps();

  $displayObject.includeInBuild;

  let $isMounted = false;
  let $isRemoved = false;
  let $isPointerInside = false;
  let $tooltip = tooltip;

  const $$setLabel = $component.setLabel;
  const $$setPosition = $component.setPosition;
  const $$getPosition = $component.getPosition;
  const $$setPositionX = $component.setPositionX;
  const $$setPositionY = $component.setPositionY;
  const $$setAngle = $component.setAngle;
  const $$getAngle = $component.getAngle;
  const $$getFather = $component.getFather;

  const $$destroy = $component.$destroy;
  const $$getRaw = $component.$getRaw;

  const $mount = () => {
    if (!getVisible() || $isMounted || !$$getFather()) return;
    $emit(DisplayObjectEvent.MOUNT, {});
  };
  const $unmount = () => {
    if (!$isMounted) return;
    $emit(DisplayObjectEvent.UNMOUNT, {});
  };
  //label
  const setLabel = (label: string) => {
    $$setLabel(label);
    $displayObject.label = label;
  };

  //position
  const setPosition = (data) => {
    $$setPosition(data);
    $displayObject.position = $$getPosition();
  };
  const setPositionX = (data) => {
    $$setPositionX(data);
    $displayObject.position.x = $$getPosition().x;
  };
  const setPositionY = (data) => {
    $$setPositionY(data);
    $displayObject.position.y = $$getPosition().y;
  };

  //pivot
  const setPivot = (data) => {
    $displayObject.pivot = global.normalizePoint(
      getValueMutableFunction<Point>(data, $displayObject.pivot),
    );
  };
  const setPivotX = (data) => {
    $displayObject.pivot.x = global.normalizeValue(
      getValueMutableFunction<number>(data, $displayObject.pivot.x),
    );
  };
  const setPivotY = (data) => {
    $displayObject.pivot.y = global.normalizeValue(
      getValueMutableFunction<number>(data, $displayObject.pivot.y),
    );
  };
  const getPivot = () =>
    ({
      x: $displayObject?.pivot?.x || 0,
      y: $displayObject?.pivot?.y || 0,
    }) as Point;

  const setVisible = (data) => {
    const targetVisibility = getValueMutableFunction<boolean>(
      data,
      $displayObject.visible,
    );
    if (targetVisibility === getVisible()) return;

    $displayObject.visible = targetVisibility;
    $emit(DisplayObjectEvent.VISIBILITY_CHANGE, { visible: targetVisibility });

    targetVisibility ? $mount() : $unmount();
  };
  const getVisible = () => {
    //This needs to check if the visible value is false explicitly, do not change!
    if ($displayObject.visible === false) return false;

    const father = $component.getFather?.();
    return (father as DisplayObjectMutable<any>)?.getVisible?.() ?? true;
  };

  //zIndex
  const setZIndex = (data) =>
    ($displayObject.zIndex = getValueMutableFunction<number>(
      data,
      $displayObject.zIndex,
    ));
  const getZIndex = () => $displayObject.zIndex;

  //alpha
  const setAlpha = (data) =>
    ($displayObject.alpha = getValueMutableFunction<number>(
      data,
      $displayObject.alpha,
    ));
  const getAlpha = () => $displayObject.alpha;

  //angle
  const setAngle = (data) => {
    $displayObject.angle = getValueMutableFunction<number>(
      data,
      $displayObject.angle,
    );
    $$setAngle($displayObject.angle);
  };
  const getAngle = () => $$getAngle() || $displayObject.angle;

  //eventMode
  const setEventMode = (data) => {
    $displayObject.eventMode = getValueMutableFunction<EventMode>(
      data,
      $displayObject.eventMode as EventMode,
    );
    $$setAngle($displayObject.angle);
  };
  const getEventMode = () => $displayObject.eventMode as EventMode;

  //tint
  const setTint = (data) => {
    $displayObject.tint = getValueMutableFunction<number>(
      data,
      $displayObject.tint,
    );
  };
  const getTint = () => $displayObject.tint;

  //bounds
  const getBounds = () => {
    const { width, height } = $displayObject.getBounds();
    return { width, height };
  };

  //cursor
  const setCursor = (data, ignoreWarn: boolean = false) => {
    $displayObject.cursor = getValueMutableFunction<Cursor>(
      data,
      $displayObject.cursor as Cursor,
    );
    // if pointer is inside, change global one
    if ($isPointerInside)
      global.cursor.setCursor($displayObject.cursor as Cursor);
    //document.body.querySelector('canvas').style.cursor = 'pointer'
    const eventMode = getEventMode();
    if (
      $displayObject.cursor !== Cursor.AUTO &&
      eventMode !== EventMode.STATIC &&
      eventMode !== EventMode.DYNAMIC &&
      !ignoreWarn
    )
      console.warn(
        `Cursor cannot be set if 'EventMode' is not 'static' or 'dynamic'!`,
      );
  };
  const getCursor = (): Cursor =>
    ($displayObject.cursor as Cursor) || Cursor.AUTO;

  //hitArea
  const setHitArea = (data) => {
    const hitArea = getValueMutableFunction<number[]>(data, getHitArea());
    $displayObject.hitArea = new PIXI.Polygon(hitArea);
  };
  const getHitArea = () => ($displayObject.hitArea as any)?.points || [];

  //scale
  const setScale = (data) => {
    $displayObject.scale = global.normalizePoint(
      getValueMutableFunction<Point>(data, $displayObject.scale),
    );
  };
  const setScaleX = (data) => {
    $displayObject.scale.x = global.normalizeValue(
      getValueMutableFunction<number>(data, $displayObject.scale.x),
    );
  };
  const setScaleY = (data) => {
    $displayObject.scale.y = global.normalizeValue(
      getValueMutableFunction<number>(data, $displayObject.scale.y),
    );
  };
  const getScale = () =>
    ({
      x: $displayObject?.scale?.x || 0,
      y: $displayObject?.scale?.y || 0,
    }) as Point;
  const getMetadata = () => metadata;
  const setTooltip = (tooltip?: string) => {
    $tooltip = tooltip;
  };
  const getTooltip = () => $tooltip;

  const isCursorInside = () => {
    const cursorPoint = global.cursor.getPosition();
    return $displayObject
      .getBounds()
      .containsPoint(cursorPoint.x, cursorPoint.y);
  };
  const isInStage = () => {
    const application = global.getApplication();
    const father = $component.getFather?.() as ContainerMutable;
    if (!father) return false;
    if ((father as unknown as ApplicationMutable) === application) return true;
    return father?.isInStage?.();
  };

  const $destroy = () => {
    $component.$setFatherId(null);

    $$destroy();
  };
  const $getRaw = (): DisplayObjectProps<Props, Data> => ({
    ...$$getRaw(),
    pivot: getPivot(),
    visible: getVisible(),
    zIndex: getZIndex(),
    alpha: getAlpha(),
    eventMode: getEventMode(),
    hitArea: getHitArea(),
    cursor: getCursor(),
    withContext: getWithContext(),
    sortableChildren: isSortableChildren(),
    tint: getTint(),
    scale: getScale(),
    metadata: getMetadata(),
    tooltip: getTooltip(),
  });
  let $removeOnTickEvent: () => void;

  $displayObject.on(DisplayObjectEvent.ADDED, () => {
    $mount();
    $isRemoved = false;
  });
  $displayObject.on(DisplayObjectEvent.REMOVED, () => {
    $unmount();
    $isRemoved = true;
    $removeOnTickEvent !== undefined && $removeOnTickEvent();
    global.context.$removeComponent($getContextBaseMutable());
  });
  $displayObject.on(DisplayObjectEvent.DESTROYED, () => {
    $unmount();
  });

  const on = (
    event: DisplayObjectEvent,
    callback: (data?: any) => void,
  ): (() => void) => {
    const $callback = (data: any) => {
      if (
        $isRemoved &&
        ![
          DisplayObjectEvent.REMOVED,
          DisplayObjectEvent.DESTROYED,
          DisplayObjectEvent.MOUNT,
          DisplayObjectEvent.UNMOUNT,
        ].includes(event)
      )
        return;
      callback(data);
    };

    switch (event) {
      case DisplayObjectEvent.TICK:
        $removeOnTickEvent = global.events.on(Event.TICK, $callback);
        return;
    }
    $displayObject.on(event, $callback);
    return () => {
      $displayObject.off(event, $callback);
    };
  };

  const $emit = (event: DisplayObjectEvent, data: any) =>
    $displayObject.emit(event, data);

  const $getContextBaseMutable = () =>
    ({
      getId: $component.getId,
      $emit,
      getWithContext,
    }) as unknown as DisplayObjectMutable<any>;

  const focus = () => {
    if (!getWithContext()) return;
    // Implements only the necessary functions
    global.context.focus($getContextBaseMutable());
  };

  const blur = () => {
    if (!getWithContext() || !isFocused()) return;
    global.context.blur();
  };

  const isFocused = () => global.context.getFocus() === $component.getId();

  const getWithContext = () => Boolean(withContext);

  const isMounted = () => $isMounted;

  const setSortableChildren = (data) => {
    $displayObject.sortableChildren = getValueMutableFunction<boolean>(
      data,
      isSortableChildren(),
    );
  };

  const isSortableChildren = () => $displayObject.sortableChildren;
  const sortChildren = () => $displayObject.sortChildren();

  //mask
  const setMask = (
    displayObject: DisplayObjectMutable<DO, unknown, unknown, unknown>,
  ) => {
    removeMask();
    const $currentDisplayObject = displayObject.getDisplayObject({
      __preventWarning: true,
    });
    $displayObject.addChild($currentDisplayObject);
    $displayObject.mask = $currentDisplayObject;
  };
  const removeMask = () => {
    if (!$displayObject.mask) return;

    $displayObject.removeChild($displayObject.mask as Container);
    $displayObject.mask = null;
  };
  //global position
  const getGlobalPosition = (): Point => {
    const position = $displayObject.getGlobalPosition();
    return {
      x: position.x,
      y: position.y,
    };
  };

  // Set initials
  {
    const {
      label,
      position,
      pivot,
      angle,
      alpha,
      eventMode,
      tint,
      cursor,
      hitArea,
      visible,
      zIndex,
      sortableChildren,
      scale,
      tooltip,
    } = $component.getProps();

    if (isNotNullish(label)) setLabel(label);
    if (isNotNullish(position)) setPosition(position);
    if (isNotNullish(pivot)) setPivot(pivot);
    if (isNotNullish(alpha)) setAlpha(alpha);
    if (isNotNullish(tint)) setTint(tint);
    if (isNotNullish(hitArea)) setHitArea(hitArea);
    if (isNotNullish(visible)) setVisible(visible);
    if (isNotNullish(zIndex)) setZIndex(zIndex);

    setAngle(angle || 0);
    setEventMode(eventMode || EventMode.PASSIVE);

    if (withContext) global.context.$addComponent($getContextBaseMutable());

    setCursor(cursor || Cursor.AUTO);
    setSortableChildren(Boolean(sortableChildren));
    setScale(scale ?? { x: 1, y: 1 });
    setTooltip(tooltip);

    on(DisplayObjectEvent.TICK, () => {
      // If not body present, it doesn't make sense to iterate
      if (!$component?.getBody()) return;

      setPosition(global.normalizePoint($component.getPosition()));
      setAngle($component.getAngle());
    });
    on(DisplayObjectEvent.POINTER_ENTER, () => {
      $isPointerInside = true;
      if (tooltip) global.tooltip.setTooltip(tooltip);
    });
    on(DisplayObjectEvent.POINTER_LEAVE, () => {
      $isPointerInside = false;
      if (tooltip) global.tooltip.setTooltip(null);
    });
    on(DisplayObjectEvent.DESTROYED, () => {
      if ($isPointerInside) global.tooltip.setTooltip(null);
    });
    on(DisplayObjectEvent.MOUNT, () => {
      $isMounted = true;
    });
    on(DisplayObjectEvent.UNMOUNT, () => {
      $isMounted = false;
    });
  }

  const $mutable = {
    getDisplayObject: (props) => {
      if (!props?.__preventWarning)
        console.warn(
          `Prevent the use of "getDisplayObject()" in favor to add more functions to do specific tasks!`,
        );
      return $displayObject as DisplayObject;
    },

    setLabel,
    //position
    setPosition,
    setPositionX,
    setPositionY,

    //pivot
    setPivot,
    setPivotX,
    setPivotY,
    getPivot,
    //visible
    setVisible,
    getVisible,
    //zIndex
    setZIndex,
    getZIndex,
    //alpha
    setAlpha,
    getAlpha,
    //angle
    setAngle,
    getAngle,
    //eventMode
    setEventMode,
    getEventMode,
    //tint
    setTint,
    getTint,
    //bounds
    getBounds,
    //cursor
    setCursor,
    getCursor,
    //hitArea
    setHitArea,
    getHitArea,
    //sortableChildren
    setSortableChildren,
    isSortableChildren,
    sortChildren,
    //mask
    setMask,
    removeMask,
    //scale
    setScale,
    setScaleX,
    setScaleY,
    getScale,
    //global position
    getGlobalPosition,

    getMetadata,
    //tooltip,
    setTooltip,
    getTooltip,

    //cursor inside
    isCursorInside,
    //stage
    isInStage,

    //events
    on,
    $emit,

    //context
    focus,
    blur,
    isFocused,
    getWithContext,

    //mount
    isMounted,

    $destroy,
    $getRaw,
  } as DisplayObjectMutable<DisplayObject, Props, Mutable, Data>;

  return $component.getComponent(displayObject, $mutable);
};
