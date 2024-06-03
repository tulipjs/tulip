import {
  ComponentMutable,
  DisplayObject as DO,
  DisplayObjectMutable,
  DisplayObjectProps,
  Point,
} from "../types";
import { getValueMutableFunction } from "./mutables.utils";
import { DISPLAY_OBJECT_DEFAULT_PROPS } from "../consts";
import { createTicker } from "./ticker.utils";

export const getDisplayObjectMutable = <DisplayObject extends DO>(
  displayObject: DisplayObject,
  componentMutable?: ComponentMutable,
) => ({
  ...componentMutable,

  getDisplayObject: (): DisplayObject => displayObject,

  setLabel: (label: string) => {
    componentMutable.setLabel(label);
    displayObject.label = label;
  },
  //position
  setPosition: async (data) => {
    componentMutable.setPosition(data);
    displayObject.position = await getValueMutableFunction<Point>(
      data,
      componentMutable.getPosition(),
    );
  },
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
  setPivot: async (data) =>
    (displayObject.pivot = await getValueMutableFunction<Point>(
      data,
      displayObject.pivot,
    )),
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
  getPivot: () => displayObject.pivot,
  //events
  on: (event, callback) => displayObject.on(event, callback),
  //visible
  setVisible: async (data) =>
    (displayObject.visible = await getValueMutableFunction<boolean>(
      data,
      displayObject.visible,
    )),
  getVisible: () => displayObject.visible,
  //zIndex
  setZIndex: async (data) =>
    (displayObject.zIndex = await getValueMutableFunction<number>(
      data,
      displayObject.zIndex,
    )),
  getZIndex: () => displayObject.zIndex,
  //alpha
  setAlpha: async (data) =>
    (displayObject.alpha = await getValueMutableFunction<number>(
      data,
      displayObject.alpha,
    )),
  getAlpha: () => displayObject.alpha,

  _step: () => {
    displayObject.position.copyFrom(componentMutable.getPosition());
    displayObject.angle = componentMutable.getAngle();
  },
});

export const setDisplayObjectProps = <DisplayObject extends DO>(
  displayObject: DisplayObject,
  {
    label,
    position = DISPLAY_OBJECT_DEFAULT_PROPS.position,
    pivot = DISPLAY_OBJECT_DEFAULT_PROPS.pivot,
    eventMode = DISPLAY_OBJECT_DEFAULT_PROPS.eventMode,
    visible = DISPLAY_OBJECT_DEFAULT_PROPS.visible,
    alpha = DISPLAY_OBJECT_DEFAULT_PROPS.alpha,
  }: DisplayObjectProps = DISPLAY_OBJECT_DEFAULT_PROPS,
  displayObjectMutable?: DisplayObjectMutable<DisplayObject>,
) => {
  label && (displayObject.label = label);

  position && displayObject.position.copyFrom(position);
  pivot && displayObject.pivot.copyFrom(pivot);
  displayObject.alpha = alpha || 0;

  displayObject.visible = Boolean(visible);

  eventMode && (displayObject.eventMode = eventMode);

  createTicker(displayObject, ({ deltaTime }) => {
    // If not body present, it doesn't make sense to iterate
    if (!displayObjectMutable?.getBody()) return;

    displayObject.position.copyFrom(displayObjectMutable.getPosition());
    displayObject.angle = displayObjectMutable.getAngle();
  });
};
