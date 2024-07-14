import {
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

export const displayObject = async <
  DisplayObject extends DO,
  Props = {},
  Mutable = {},
  Data = {},
>(
  {
    displayObject: $displayObject,
    ...originalProps
  }: DisplayObjectProps<Props, Data> = {} as DisplayObjectProps<Props, Data>,
): Promise<DisplayObjectMutable<DisplayObject, Props, Mutable, Data>> => {
  const $component = component<DisplayObjectProps<Props, Data>>(
    originalProps as DisplayObjectProps<Props, Data>,
  );

  const { withContext } = $component.getProps();

  let $isRemoved = false;
  let $withContext = withContext;

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
  const setPosition = async (data) => {
    await $$setPosition(data);
    $displayObject.position = $$getPosition();
  };
  const setPositionX = async (data) => {
    await $$setPositionX(data);
    $displayObject.position.x = $$getPosition().x;
  };
  const setPositionY = async (data) => {
    await $$setPositionY(data);
    $displayObject.position.y = $$getPosition().y;
  };

  //pivot
  const setPivot = async (data) => {
    $displayObject.pivot = global.normalizePoint(
      await getValueMutableFunction<Point>(data, $displayObject.pivot),
    );
  };
  const setPivotX = async (data) => {
    $displayObject.pivot.x = global.normalizeValue(
      await getValueMutableFunction<number>(data, $displayObject.pivot.x),
    );
  };
  const setPivotY = async (data) => {
    $displayObject.pivot.y = global.normalizeValue(
      await getValueMutableFunction<number>(data, $displayObject.pivot.y),
    );
  };
  const getPivot = () =>
    ({
      x: $displayObject?.pivot?.x || 0,
      y: $displayObject?.pivot?.y || 0,
    }) as Point;

  const setVisible = async (data) =>
    ($displayObject.visible = await getValueMutableFunction<boolean>(
      data,
      $displayObject.visible,
    ));
  const getVisible = () => $displayObject.visible;

  //zIndex
  const setZIndex = async (data) =>
    ($displayObject.zIndex = await getValueMutableFunction<number>(
      data,
      $displayObject.zIndex,
    ));
  const getZIndex = () => $displayObject.zIndex;

  //alpha
  const setAlpha = async (data) =>
    ($displayObject.alpha = await getValueMutableFunction<number>(
      data,
      $displayObject.alpha,
    ));
  const getAlpha = () => $displayObject.alpha;

  //angle
  const setAngle = async (data) => {
    $displayObject.angle = await getValueMutableFunction<number>(
      data,
      $displayObject.angle,
    );
    await $$setAngle($displayObject.angle);
  };
  const getAngle = () => $$getAngle() || $displayObject.angle;

  //eventMode
  const setEventMode = async (data) => {
    $displayObject.eventMode = await getValueMutableFunction<EventMode>(
      data,
      $displayObject.eventMode as EventMode,
    );
    await $$setAngle($displayObject.angle);
  };
  const getEventMode = () => $displayObject.eventMode as EventMode;

  //tint
  const setTint = async (data) => {
    $displayObject.tint = await getValueMutableFunction<number>(
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
  const setCursor = async (data, ignoreWarn: boolean = false) => {
    $displayObject.cursor = await getValueMutableFunction<Cursor>(
      data,
      $displayObject.cursor as Cursor,
    );
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
  const setHitArea = async (data) => {
    const hitArea = await getValueMutableFunction<number[]>(data, getHitArea());
    $displayObject.hitArea = new PIXI.Polygon(hitArea);
  };
  const getHitArea = () => ($displayObject.hitArea as any)?.points || [];

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
    focused: isFocused(),
    cursor: getCursor(),
    withContext: getWithContext(),
    sortableChildren: isSortableChildren(),
    tint: getTint(),
  });
  let $removeOnTickEvent: () => void;

  $displayObject.on(DisplayObjectEvent.REMOVED, () => {
    $isRemoved = true;
    $removeOnTickEvent !== undefined && $removeOnTickEvent();
  });

  const on = (event: DisplayObjectEvent, callback: (data?: any) => void) => {
    const $callback = (data: any) => {
      if ($isRemoved) return;
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
    global.context.set($getContextBaseMutable());
  };

  const blur = () => {
    if (!getWithContext()) return;
    // Implements only the necessary functions
    global.context.remove($getContextBaseMutable());
  };

  const isFocused = () => global.context.has($getContextBaseMutable());

  const setWithContext = async (data) => {
    $withContext = await getValueMutableFunction<boolean>(
      data,
      getWithContext(),
    );
  };

  const getWithContext = () => $withContext;

  const setSortableChildren = async (data) => {
    $displayObject.sortableChildren = await getValueMutableFunction<boolean>(
      data,
      isSortableChildren(),
    );
  };

  const isSortableChildren = () => $displayObject.sortableChildren;
  const sortChildren = () => $displayObject.sortChildren();

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
      focused,
      sortableChildren,
    } = $component.getProps();

    if (isNotNullish(label)) setLabel(label);
    if (isNotNullish(position)) await setPosition(position);
    if (isNotNullish(pivot)) await setPivot(pivot);
    if (isNotNullish(alpha)) await setAlpha(alpha);
    if (isNotNullish(tint)) await setTint(tint);
    if (isNotNullish(hitArea)) await setHitArea(hitArea);
    if (isNotNullish(visible)) await setVisible(visible);
    if (isNotNullish(zIndex)) await setZIndex(zIndex);

    await setAngle(angle || 0);
    await setEventMode(eventMode || EventMode.PASSIVE);
    await setWithContext(isNotNullish(withContext) ? withContext : false);
    // This is not an error
    if ($withContext && focused) global.context.add($getContextBaseMutable());
    await setCursor(cursor || Cursor.AUTO);
    await setSortableChildren(Boolean(sortableChildren));

    on(DisplayObjectEvent.TICK, () => {
      // If not body present, it doesn't make sense to iterate
      if (!$component?.getBody()) return;

      setPosition(global.normalizePoint($component.getPosition()));
      setAngle($component.getAngle());
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

    //events
    on,
    $emit,

    //context
    focus,
    blur,
    isFocused,
    setWithContext,
    getWithContext,

    $destroy,
    $getRaw,
  } as DisplayObjectMutable<DisplayObject, Props, Mutable, Data>;

  return $component.getComponent(displayObject, $mutable);
};
