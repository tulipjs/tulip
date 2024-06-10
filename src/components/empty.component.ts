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

  let _id = `${label}_${getRandomNumber(0, 100_000)}`;
  let _position: Point = {
    x: position?.x || 0,
    y: position?.y || 0,
  };
  let _angle = 0;
  let _label = label;
  let _body: BodyMutable;

  const getId = () => _id;

  const getLabel = () => _label;
  const setLabel = (label: string) => (_label = label);

  const getBody = () => _body;
  const setBody = (body: BodyMutable) => {
    _body = body;
    _body.setPosition(_position);
  };

  const setPosition = async (data) => {
    _position = await getValueMutableFunction<Point>(data, _position);
    _body?.setPosition(_position);
  };
  const getPosition = () => _body?.getPosition() || _position;

  const getAngle = () => _body?.getAngle() || _angle;
  const setAngle = (angle: number) => {
    _angle = angle;
    _body?.setAngle(angle);
  };

  return {
    getId,

    getLabel,
    setLabel,

    setBody,
    getBody,

    //position
    setPosition,
    setPositionX: async (data) => {
      _position.x = await getValueMutableFunction<number>(data, _position.x);
      _body?.setPosition(_position);
    },
    setPositionY: async (data) => {
      _position.y = await getValueMutableFunction<number>(data, _position.y);
      _body?.setPosition(_position);
    },
    getPosition,

    getAngle,
    setAngle,

    getFather: null,

    $props,
    $destroy: () => {},

    $mutable: false,
  };
};
