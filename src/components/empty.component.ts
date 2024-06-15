import {
  BodyMutable,
  ComponentMutable,
  ComponentProps,
  Component,
  Point,
} from "../types";
import { getRandomNumber, getValueMutableFunction } from "../utils";

export type EmptyProps = {} & ComponentProps;

export type EmptyMutable = {} & ComponentMutable<ComponentProps>;

export const empty: Component<EmptyProps, EmptyMutable, false> = (
  originalProps = {},
) => {
  const { label = "empty", position } = originalProps;
  const $props = structuredClone(originalProps);

  let $id = `${label}_${getRandomNumber(0, 100_000)}`;
  let $position: Point = {
    x: position?.x || 0,
    y: position?.y || 0,
  };
  let $angle = 0;
  let $label = label;
  let $body: BodyMutable;

  const getId = () => $id;

  const getLabel = () => $label;
  const setLabel = (label: string) => ($label = label);

  const getBody = () => $body;
  const setBody = (body: BodyMutable) => {
    $body = body;
    $body.setPosition($position);
  };

  const setPosition = async (data) => {
    $position = await getValueMutableFunction<Point>(data, $position);
    $body?.setPosition($position);
  };
  const getPosition = () => $body?.getPosition() || $position;

  const getAngle = () => $body?.getAngle() || $angle;
  const setAngle = (angle: number) => {
    $angle = angle;
    $body?.setAngle(angle);
  };

  const $getRaw = (): EmptyProps => ({
    id: $id,
    label: $label,
    position: getPosition(),
    angle: getAngle(),
  });

  return {
    getId,

    getLabel,
    setLabel,

    setBody,
    getBody,

    //position
    setPosition,
    setPositionX: async (data) => {
      $position.x = await getValueMutableFunction<number>(data, $position.x);
      $body?.setPosition($position);
    },
    setPositionY: async (data) => {
      $position.y = await getValueMutableFunction<number>(data, $position.y);
      $body?.setPosition($position);
    },
    getPosition,

    getAngle,
    setAngle,

    getFather: null,

    getProps: () => $props as any,

    $destroy: () => {},
    $getRaw,

    $mutable: false,
  };
};
