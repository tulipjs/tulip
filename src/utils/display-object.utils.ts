import {
  DisplayObject as PIXIDisplayObject,
  DisplayObjectProps,
  InternalAsyncDisplayObjectMutable,
  InternalDisplayObjectMutable,
  Point,
} from "../types";
import { getValueMutableFunction } from "./mutables.utils";
import { DisplayObjectEvent, Event, EventMode } from "../enums";
import { global } from "../global";
import { isNullish } from "./nullish.utils";

export const initDisplayObjectMutable = async <
  DisplayObject extends PIXIDisplayObject,
>(
  displayObject: DisplayObject,
  componentMutable: InternalDisplayObjectMutable<any, {}, {}, {}>,
): InternalAsyncDisplayObjectMutable<DisplayObject, {}, {}, {}> => {
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

  const $destroy = () => {
    componentMutable.getFather = () => null;

    $$destroy();
  };
  const $getRaw = (): DisplayObjectProps => ({
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
    const { label, position, pivot, angle, alpha, eventMode, tint } =
      componentMutable.getProps();

    if (isNullish(label)) setLabel(label);
    if (isNullish(position)) await setPosition(position);
    if (isNullish(pivot)) await setPivot(pivot);
    if (isNullish(angle)) await setAngle(angle);
    if (isNullish(alpha)) await setAlpha(alpha);
    if (isNullish(eventMode)) await setEventMode(eventMode);
    if (isNullish(tint)) await setEventMode(eventMode);

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
