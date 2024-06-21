import {
  ComponentMutable,
  DisplayObject as PIXIDisplayObject,
  DisplayObjectMutable,
  DisplayObjectProps,
  Point,
} from "../types";
import { getValueMutableFunction } from "./mutables.utils";
import { DISPLAY_OBJECT_DEFAULT_PROPS } from "../consts";
import { degreesToRadians, radiansToDegrees } from "../utils";
import { DisplayObjectEvent, Event } from "../enums";
import { global } from "../global";

export const getDisplayObjectMutable = <
  DisplayObject extends PIXIDisplayObject,
>(
  displayObject: DisplayObject,
  componentMutable?: ComponentMutable,
) => {
  let $isRemoved = false;

  const setLabel = (label: string) => {
    componentMutable.setLabel(label);
    displayObject.label = label;
  };

  const setPosition = async (data) => {
    componentMutable.setPosition(data);
    displayObject.position = await getValueMutableFunction<Point>(
      data,
      componentMutable.getPosition(),
    );
  };

  const setPivot = async (data) =>
    (displayObject.pivot = await getValueMutableFunction<Point>(
      data,
      displayObject.pivot,
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

  const setZIndex = async (data) =>
    (displayObject.zIndex = await getValueMutableFunction<number>(
      data,
      displayObject.zIndex,
    ));
  const getZIndex = () => displayObject.zIndex;

  const setAlpha = async (data) =>
    (displayObject.alpha = await getValueMutableFunction<number>(
      data,
      displayObject.alpha,
    ));
  const getAlpha = () => displayObject.alpha;

  const $getRaw = (): DisplayObjectProps => ({
    ...componentMutable.$getRaw(),
    pivot: getPivot(),
    visible: getVisible(),
    zIndex: getZIndex(),
    alpha: getAlpha(),
  });

  let $onTickEventId: number;
  displayObject.on(DisplayObjectEvent.REMOVED, () => {
    $isRemoved = true;
    $onTickEventId !== undefined &&
      global.events.remove(Event.TICK, $onTickEventId);
  });

  const on = (event: DisplayObjectEvent, callback: (data?: any) => void) => {
    const $callback = (data: any) => {
      if ($isRemoved) return;
      callback(data);
    };

    switch (event) {
      case DisplayObjectEvent.TICK:
        $onTickEventId = global.events.on(Event.TICK, $callback);
        return;
    }
    displayObject.on(event as any, $callback);
  };

  return {
    ...componentMutable,

    getDisplayObject: (): DisplayObject => displayObject,

    setLabel,
    //position
    setPosition,
    setPositionX: async (data) => {
      componentMutable.setPositionX(data);
      displayObject.position.x = await getValueMutableFunction<number>(
        data,
        componentMutable.getPosition().x,
      );
    },
    setPositionY: async (data) => {
      componentMutable.setPositionY(data);
      displayObject.position.y = await getValueMutableFunction<number>(
        data,
        componentMutable.getPosition().y,
      );
    },

    //pivot
    setPivot,
    setPivotX: async (data) =>
      (displayObject.pivot.x = await getValueMutableFunction<number>(
        data,
        displayObject.pivot.x,
      )),
    setPivotY: async (data) =>
      (displayObject.pivot.y = await getValueMutableFunction<number>(
        data,
        displayObject.pivot.y,
      )),
    getPivot,

    //events
    on,
    //visible
    setVisible,
    getVisible,
    //zIndex
    setZIndex,
    getZIndex,
    //alpha
    setAlpha,
    getAlpha,

    $getRaw,
    $mutable: false,
  };
};

export const setDisplayObjectProps = <DisplayObject extends PIXIDisplayObject>(
  displayObject: DisplayObject,
  {
    label,
    position = DISPLAY_OBJECT_DEFAULT_PROPS.position,
    pivot = DISPLAY_OBJECT_DEFAULT_PROPS.pivot,
    eventMode = DISPLAY_OBJECT_DEFAULT_PROPS.eventMode,
    visible = DISPLAY_OBJECT_DEFAULT_PROPS.visible,
    alpha = DISPLAY_OBJECT_DEFAULT_PROPS.alpha,
    angle = 0,
    zIndex = 0,
    rotation = 0,
  }: DisplayObjectProps = DISPLAY_OBJECT_DEFAULT_PROPS,
  displayObjectMutable?: DisplayObjectMutable<DisplayObject>,
) => {
  label && (displayObject.label = label);

  position && displayObject.position.copyFrom(position);
  pivot && displayObject.pivot.copyFrom(pivot);
  displayObject.alpha = alpha || 0;
  zIndex !== undefined && (displayObject.zIndex = zIndex);

  angle && (displayObject.angle = degreesToRadians(angle));

  rotation && (displayObject.rotation = rotation);

  displayObject.visible = Boolean(visible);

  eventMode && (displayObject.eventMode = eventMode);

  displayObjectMutable.on(DisplayObjectEvent.TICK, () => {
    // If not body present, it doesn't make sense to iterate
    if (!displayObjectMutable?.getBody()) return;

    displayObject.position.copyFrom(displayObjectMutable.getPosition());
    displayObject.angle = radiansToDegrees(displayObjectMutable.getAngle());
    displayObject.rotation = displayObjectMutable.getRotation();
  });
};
