import { DisplayObject, DisplayObjectProps } from "../types";
import { getValueMutableFunction } from "./mutables.utils";
import { DISPLAY_OBJECT_DEFAULT_PROPS } from "../consts";

export const getDisplayObjectMutable = (displayObject: DisplayObject) => ({
  getDisplayObject: () => displayObject,
  //position
  setPosition: async (data) =>
    displayObject.position = await getValueMutableFunction<number>(
      data,
      displayObject.position,
    ),
  setPositionX: async (data) =>
    displayObject.position.x = await getValueMutableFunction<number>(
      data,
      displayObject.position.x,
    ),
  setPositionY: async (data) =>
    displayObject.position.y = await getValueMutableFunction<number>(
      data,
      displayObject.position.y,
    ),
  getPosition: () => displayObject.position,
  //pivot
  setPivot: async (data) =>
    displayObject.pivot = await getValueMutableFunction<number>(
      data,
      displayObject.position,
    ),
  setPivotX: async (data) =>
    displayObject.pivot.x = await getValueMutableFunction<number>(
      data,
      displayObject.position.x,
    ),
  setPivotY: async (data) =>
    displayObject.pivot.y = await getValueMutableFunction<number>(
      data,
      displayObject.position.y,
    ),
  getPivot: () => displayObject.pivot,
  //events
  on: (event, callback) => displayObject.on(event, callback),
  //visible
  setVisible: async (data) =>
    displayObject.visible = await getValueMutableFunction<number>(
      data,
      displayObject.visible,
    ),
  getVisible: () => displayObject.visible,
  //zIndex
  setZIndex: async (data) =>
    displayObject.zIndex = await getValueMutableFunction<number>(
      data,
      displayObject.zIndex,
    ),
  getZIndex: () => displayObject.zIndex,
  //alpha
  setAlpha: async (data) =>
    displayObject.alpha = await getValueMutableFunction<number>(
      data,
      displayObject.alpha,
    ),
  getAlpha: () => displayObject.alpha,
});

export const setDisplayObjectProps = (displayObject: DisplayObject, {
  id,
  label,
  position = DISPLAY_OBJECT_DEFAULT_PROPS.position,
  pivot = DISPLAY_OBJECT_DEFAULT_PROPS.pivot,
  eventMode = DISPLAY_OBJECT_DEFAULT_PROPS.eventMode,
  visible = DISPLAY_OBJECT_DEFAULT_PROPS.visible,
  alpha = DISPLAY_OBJECT_DEFAULT_PROPS.alpha,
}: DisplayObjectProps = DISPLAY_OBJECT_DEFAULT_PROPS) => {
  id && (displayObject.id = id);
  label && (displayObject.label = label);

  position && displayObject.position.copyFrom(position);
  pivot && displayObject.pivot.copyFrom(pivot);
  displayObject.alpha = alpha || 0;

  displayObject.visible = Boolean(visible);

  eventMode && (displayObject.eventMode = eventMode);
};
