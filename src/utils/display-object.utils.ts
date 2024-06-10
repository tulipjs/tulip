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
import { degreesToRadians, radiansToDegrees } from "../utils";

export const getDisplayObjectMutable = <DisplayObject extends DO>(
  displayObject: DisplayObject,
  componentMutable?: ComponentMutable,
) => {
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
      x: displayObject.pivot.x,
      y: displayObject.pivot.y,
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

  const $getRaw = async (): Promise<DisplayObjectProps> => {
    return {
      ...(await componentMutable.$getRaw()),
      pivot: getPivot(),
      visible: getVisible(),
      zIndex: getZIndex(),
      alpha: getAlpha(),
    };
  };
  const $setRaw = async ({
    position,
    visible,
    zIndex,
    alpha,
    eventMode,
    pivot,
    ...raw
  }: DisplayObjectProps) => {
    await componentMutable.$setRaw(raw);
    await setPosition(position);
    await setVisible(visible);
    await setZIndex(zIndex);
    await setAlpha(alpha);
    await setPivot(pivot);
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
    on: (event, callback) => displayObject.on(event, callback),
    //visible
    setVisible,
    getVisible,
    //zIndex
    setZIndex,
    getZIndex,
    //alpha
    setAlpha,
    getAlpha,

    _step: () => {
      displayObject.position.copyFrom(componentMutable.getPosition());
      displayObject.angle = componentMutable.getAngle();
    },

    $getRaw,
    $setRaw,
    $mutable: false,
  };
};

export const setDisplayObjectProps = <DisplayObject extends DO>(
  displayObject: DisplayObject,
  {
    label,
    position = DISPLAY_OBJECT_DEFAULT_PROPS.position,
    pivot = DISPLAY_OBJECT_DEFAULT_PROPS.pivot,
    eventMode = DISPLAY_OBJECT_DEFAULT_PROPS.eventMode,
    visible = DISPLAY_OBJECT_DEFAULT_PROPS.visible,
    alpha = DISPLAY_OBJECT_DEFAULT_PROPS.alpha,
    angle = 0,
  }: DisplayObjectProps = DISPLAY_OBJECT_DEFAULT_PROPS,
  displayObjectMutable?: DisplayObjectMutable<DisplayObject>,
) => {
  label && (displayObject.label = label);

  position && displayObject.position.copyFrom(position);
  pivot && displayObject.pivot.copyFrom(pivot);
  displayObject.alpha = alpha || 0;

  angle && (displayObject.angle = degreesToRadians(angle));

  displayObject.visible = Boolean(visible);

  eventMode && (displayObject.eventMode = eventMode);

  createTicker(displayObject, ({ deltaTime }) => {
    // If not body present, it doesn't make sense to iterate
    if (!displayObjectMutable?.getBody()) return;

    displayObject.position.copyFrom(displayObjectMutable.getPosition());
    displayObject.angle = radiansToDegrees(displayObjectMutable.getAngle());
  });
};
