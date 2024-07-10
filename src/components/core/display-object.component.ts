import {
  ComponentProps,
  DisplayObject,
  DisplayObject as DO,
  DisplayObjectMutable,
  DisplayObjectProps,
  Point,
} from "../../types";
import { component } from "./component.component";
import { getValueMutableFunction } from "../../utils";
import { Cursor, DisplayObjectEvent, Event, EventMode } from "../../enums";
import { global } from "../../global";
import * as PIXI from "pixi.js";

export const displayObject = <
  DisplayObject extends DO,
  Props = {},
  Mutable = {},
  Data = {},
>(
  originalProps: DisplayObjectProps<Props, Data> = {} as DisplayObjectProps<
    Props,
    Data
  >,
): DisplayObjectMutable<
  DisplayObject,
  DisplayObjectProps<Props, Data>,
  Mutable,
  Data
> => {
  const $component = component<DisplayObjectProps<Props, Data>, Mutable, Data>(
    originalProps,
  );

  const { displayObject: $displayObject } = $component.getProps();

  let $isRemoved = false;

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
  const $getRaw = (): DisplayObjectProps =>
    ({
      ...($$getRaw() as ComponentProps),
      pivot: getPivot(),
      visible: getVisible(),
      zIndex: getZIndex(),
      alpha: getAlpha(),
      eventMode: getEventMode(),
    }) as DisplayObjectProps;
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

  return $component.getComponent(displayObject, {
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

    //events
    on,

    $destroy,
    $getRaw,
  });
};
