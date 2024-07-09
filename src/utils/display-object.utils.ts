import {
  DisplayObject as PIXIDisplayObject,
  PartialDisplayObjectProps,
  InternalAsyncDisplayObjectMutable,
  InternalDisplayObjectMutable,
  Point,
  DisplayObjectProps,
} from "../types";
import { getValueMutableFunction } from "./mutables.utils";
import { Cursor, DisplayObjectEvent, Event, EventMode } from "../enums";
import { global } from "../global";
import { isNotNullish } from "./nullish.utils";
import * as PIXI from "pixi.js";

export const initDisplayObjectMutable = async <
  DisplayObject extends PIXIDisplayObject,
>(
  displayObject: DisplayObject,
  componentMutable: InternalDisplayObjectMutable<any, DisplayObjectProps<any>>,
): InternalAsyncDisplayObjectMutable<DisplayObject> => {
  let $isRemoved = false;

  const $$setLabel = componentMutable.setLabel;
  const $$setPosition = componentMutable.setPosition;
  const $$getPosition = componentMutable.getPosition;
  const $$setPositionX = componentMutable.setPositionX;
  const $$setPositionY = componentMutable.setPositionY;
  const $$setAngle = componentMutable.setAngle;
  const $$getAngle = componentMutable.getAngle;

  const $$destroy = componentMutable.$destroy;
  const $$getRaw = componentMutable.$getRaw;

  //label
  const setLabel = (label: string) => {
    $$setLabel(label);
    displayObject.label = label;
  };

  //position
  const setPosition = async (data) => {
    await $$setPosition(data);
    displayObject.position = await getValueMutableFunction<Point>(
      data,
      $$getPosition(),
    );
  };
  const setPositionX = async (data) => {
    await $$setPositionX(data);
    displayObject.position.x = await getValueMutableFunction<number>(
      data,
      $$getPosition().x,
    );
  };
  const setPositionY = async (data) => {
    await $$setPositionY(data);
    displayObject.position.y = await getValueMutableFunction<number>(
      data,
      $$getPosition().y,
    );
  };

  //pivot
  const setPivot = async (data) =>
    (displayObject.pivot = await getValueMutableFunction<Point>(
      data,
      displayObject.pivot,
    ));
  const setPivotX = async (data) =>
    (displayObject.pivot.x = await getValueMutableFunction<number>(
      data,
      displayObject.pivot.x,
    ));
  const setPivotY = async (data) =>
    (displayObject.pivot.y = await getValueMutableFunction<number>(
      data,
      displayObject.pivot.y,
    ));
  const getPivot = () =>
    ({
      x: displayObject?.pivot?.x || 0,
      y: displayObject?.pivot?.y || 0,
    }) as Point;

  const setVisible = async (data) =>
    (displayObject.visible = await getValueMutableFunction<boolean>(
      data,
      displayObject.visible,
    ));
  const getVisible = () => displayObject.visible;

  //zIndex
  const setZIndex = async (data) =>
    (displayObject.zIndex = await getValueMutableFunction<number>(
      data,
      displayObject.zIndex,
    ));
  const getZIndex = () => displayObject.zIndex;

  //alpha
  const setAlpha = async (data) =>
    (displayObject.alpha = await getValueMutableFunction<number>(
      data,
      displayObject.alpha,
    ));
  const getAlpha = () => displayObject.alpha;

  //angle
  const setAngle = async (data) => {
    displayObject.angle = await getValueMutableFunction<number>(
      data,
      displayObject.angle,
    );
    await $$setAngle(displayObject.angle);
  };
  const getAngle = () => $$getAngle() || displayObject.angle;

  //eventMode
  const setEventMode = async (data) => {
    displayObject.eventMode = await getValueMutableFunction<EventMode>(
      data,
      displayObject.eventMode as EventMode,
    );
    await $$setAngle(displayObject.angle);
  };
  const getEventMode = () => displayObject.eventMode as EventMode;

  //tint
  const setTint = async (data) => {
    displayObject.tint = await getValueMutableFunction<number>(
      data,
      displayObject.tint,
    );
  };
  const getTint = () => displayObject.tint;

  //bounds
  const getBounds = () => {
    const { width, height } = displayObject.getBounds();
    return { width, height };
  };

  //cursor
  const setCursor = async (data, ignoreWarn: boolean = false) => {
    displayObject.cursor = await getValueMutableFunction<Cursor>(
      data,
      displayObject.cursor as Cursor,
    );
    const eventMode = getEventMode();
    if (
      displayObject.cursor !== Cursor.AUTO &&
      eventMode !== EventMode.STATIC &&
      eventMode !== EventMode.DYNAMIC &&
      !ignoreWarn
    )
      console.warn(
        `Cursor cannot be set if 'EventMode' is not 'static' or 'dynamic'!`,
      );
  };
  const getCursor = (): Cursor =>
    (displayObject.cursor as Cursor) || Cursor.AUTO;

  //hitArea
  const setHitArea = async (data) => {
    const hitArea = await getValueMutableFunction<number[]>(data, getHitArea());
    displayObject.hitArea = new PIXI.Polygon(hitArea);
  };
  const getHitArea = () => (displayObject.hitArea as any)?.points || [];

  const $destroy = () => {
    componentMutable.getFather = () => null;

    $$destroy();
  };
  const $getRaw = (): PartialDisplayObjectProps => ({
    ...($$getRaw() as object),
    pivot: getPivot(),
    visible: getVisible(),
    zIndex: getZIndex(),
    alpha: getAlpha(),
    eventMode: getEventMode(),
  });

  let $removeOnTickEvent: () => void;
  displayObject.on(DisplayObjectEvent.REMOVED, () => {
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
    displayObject.on(event as any, $callback);
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
    } = componentMutable.getProps();

    if (isNotNullish(label)) setLabel(label);
    if (isNotNullish(position)) await setPosition(position);
    if (isNotNullish(pivot)) await setPivot(pivot);
    if (isNotNullish(angle)) await setAngle(angle);
    if (isNotNullish(alpha)) await setAlpha(alpha);
    if (isNotNullish(eventMode)) await setEventMode(eventMode);
    if (isNotNullish(tint)) await setEventMode(eventMode);
    if (isNotNullish(cursor)) await setCursor(cursor);
    if (isNotNullish(hitArea)) await setHitArea(hitArea);

    on(DisplayObjectEvent.TICK, () => {
      // If not body present, it doesn't make sense to iterate
      if (!componentMutable?.getBody()) return;

      displayObject.position.copyFrom(componentMutable.getPosition());
      displayObject.angle = componentMutable.getAngle();
    });
  }

  const $mutable: Partial<
    InternalDisplayObjectMutable<DisplayObject, {}, {}, {}>
  > = {
    getDisplayObject: (props): DisplayObject => {
      if (!props?.__preventWarning)
        console.warn(
          `Prevent the use of "getDisplayObject()" in favor to add more functions to do specific tasks!`,
        );
      return displayObject;
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

    //events
    on,

    $destroy,
    $getRaw,
    $mutable: false,
  };

  const initDisplayObject = () => {};
  return componentMutable.getComponent(
    initDisplayObject,
    $mutable as InternalDisplayObjectMutable<DisplayObject, {}, {}, {}>,
  );
};
