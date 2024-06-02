import {
  BodyMutable,
  ComponentMutable,
  ComponentProps,
  Function,
  Point,
} from "../types";
import { getValueMutableFunction } from "../utils";

export type EmptyProps = {} & ComponentProps;

export type EmptyMutable = {} & ComponentMutable;

export const empty: Function<EmptyProps, EmptyMutable> = ({
  label,
  position,
} = {}) => {
  let _position: Point = {
    x: position?.x || 0,
    y: position?.y || 0,
  };
  let _angle = 0;
  let _label = label;
  let _body: BodyMutable;

  const getLabel = () => _label;
  const setLabel = (label: string) => (_label = label);

  const getBody = () => _body;
  const setBody = (body: BodyMutable) => {
    _body = body;
    _body.setPosition(_position);
  };

  return {
    getLabel,
    setLabel,

    setBody,
    getBody,

    //position
    setPosition: async (data) => {
      _position = await getValueMutableFunction<Point>(data, _position);
      _body?.setPosition(_position);
    },
    setPositionX: async (data) => {
      _position.x = await getValueMutableFunction<number>(data, _position.x);
      _body?.setPosition(_position);
    },
    setPositionY: async (data) => {
      _position.y = await getValueMutableFunction<number>(data, _position.y);
      _body?.setPosition(_position);
    },
    getPosition: () => _body?.getPosition() || _position,

    getAngle: () => _body?.getAngle() || _angle,

    _step: () => {
      _body && (_position = _body?.getPosition());
      _body && (_angle = _body?.getAngle());
    },
  };
};
