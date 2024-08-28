import {
  Container,
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

  const { withContext } = $component.getProps();

  let $isRemoved = false;
  let $isPointerInside = false;

  const $$setLabel = $component.setLabel;
  const $$setPosition = $component.setPosition;
  const $$getPosition = $component.getPosition;
  const $$setPositionX = $component.setPositionX;
  const $$setPositionY = $component.setPositionY;
  const $$setAngle = $component.setAngle;
  const $$getAngle = $component.getAngle;

  const $$destroy = $component.$destroy;
  const $$getRaw = $component.$getRaw;

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

  const setVisible = (data) =>
    ($displayObject.visible = getValueMutableFunction<boolean>(
      data,
      $displayObject.visible,
    ));
  const getVisible = () => $displayObject.visible;

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

  const $destroy = () => {
    $component.getFather = () => null;

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
  });
  let $removeOnTickEvent: () => void;

  $displayObject.on(DisplayObjectEvent.REMOVED, () => {
    $isRemoved = true;
    $removeOnTickEvent !== undefined && $removeOnTickEvent();
    global.context.$removeComponent($getContextBaseMutable());
  });

  const on = (event: DisplayObjectEvent, callback: (data?: any) => void) => {
    const $callback = (data: any) => {
      if (
        $isRemoved &&
        ![DisplayObjectEvent.REMOVED, DisplayObjectEvent.DESTROYED].includes(
          event,
        )
      )
        return;
      callback(data);
    };

    switch (event) {
      case DisplayObjectEvent.TICK:
        $removeOnTickEvent = global.events.on(Event.TICK, $callback);
        return;
    }
    $displayObject.on(event as any, $callback);
  };

  const $emit = (event: DisplayObjectMutable<any>, data: any) =>
    $displayObject.emit(event as any, data);

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

    on(DisplayObjectEvent.TICK, () => {
      // If not body present, it doesn't make sense to iterate
      if (!$component?.getBody()) return;

      setPosition(global.normalizePoint($component.getPosition()));
      setAngle($component.getAngle());
    });
    on(DisplayObjectEvent.POINTER_ENTER, () => {
      $isPointerInside = true;
    });
    on(DisplayObjectEvent.POINTER_LEAVE, () => {
      $isPointerInside = false;
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

    //events
    on,
    $emit,

    //context
    focus,
    blur,
    isFocused,
    getWithContext,

    $destroy,
    $getRaw,
  } as DisplayObjectMutable<DisplayObject, Props, Mutable, Data>;

  return $component.getComponent(displayObject, $mutable);
};
