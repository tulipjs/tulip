import {
  ComponentMutable,
  DisplayObject as PIXIDisplayObject,
  DisplayObjectMutable,
  DisplayObjectProps,
  Point,
} from "../types";
import { getValueMutableFunction } from "./mutables.utils";
import { DisplayObjectEvent, Event, EventMode } from "../enums";
import { global } from "../global";

export const initDisplayObjectMutable = async <
  DisplayObject extends PIXIDisplayObject,
>(
  displayObject: DisplayObject,
  componentMutable: ComponentMutable,
): Promise<DisplayObjectMutable<DisplayObject>> => {
  let $isRemoved = false;

  const setLabel = (label: string) => {
    componentMutable.setLabel(label);
    displayObject.label = label;
  };

  const setPosition = async (data) => {
    await componentMutable.setPosition(data);
    displayObject.position = await getValueMutableFunction<Point>(
      data,
      componentMutable.getPosition(),
    );
  };
  const setPositionX = async (data) => {
    await componentMutable.setPositionX(data);
    displayObject.position.x = await getValueMutableFunction<number>(
      data,
      componentMutable.getPosition().x,
    );
  };
  const setPositionY = async (data) => {
    await componentMutable.setPositionY(data);
    displayObject.position.y = await getValueMutableFunction<number>(
      data,
      componentMutable.getPosition().y,
    );
  };

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

  const setAngle = async (data) => {
    displayObject.angle = await getValueMutableFunction<number>(
      data,
      displayObject.angle,
    );
    await componentMutable.setAngle(displayObject.angle);
  };
  const getAngle = () => componentMutable.getAngle() || displayObject.angle;

  const setEventMode = async (data) => {
    displayObject.eventMode = await getValueMutableFunction<EventMode>(
      data,
      displayObject.eventMode as EventMode,
    );
    await componentMutable.setAngle(displayObject.angle);
  };
  const getEventMode = () => displayObject.eventMode as EventMode;

  const $destroy = () => {
    componentMutable.getFather = null;

    componentMutable.$destroy();
  };

  const getComponent = (component) => {
    componentMutable.getComponent(component);
    return $mutable;
  };
  const $getRaw = (): DisplayObjectProps => ({
    ...componentMutable.$getRaw(),
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
    const { label, position, pivot, angle, alpha, eventMode } =
      componentMutable.getProps<DisplayObjectProps>();

    if (label !== undefined) setLabel(label);
    if (position !== undefined) await setPosition(position);
    if (pivot !== undefined) await setPivot(pivot);
    if (angle) await setAngle(angle);
    if (alpha) await setAlpha(alpha);
    if (eventMode) await setEventMode(eventMode);

    on(DisplayObjectEvent.TICK, () => {
      // If not body present, it doesn't make sense to iterate
      if (!componentMutable?.getBody()) return;

      displayObject.position.copyFrom(componentMutable.getPosition());
      displayObject.angle = componentMutable.getAngle();
    });
  }

  const $mutable: DisplayObjectMutable<DisplayObject> = {
    ...componentMutable,

    getDisplayObject: (): DisplayObject => displayObject,

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

    //events
    on,

    //@ts-ignore
    getComponent,

    $destroy,
    $getRaw,
    $mutable: false,
  };

  return $mutable;
};
