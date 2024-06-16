import {
  BodyMutable,
  ComponentMutable,
  ComponentProps,
  Point,
  InternalMutable,
} from "../../types";
import { getRandomNumber, getValueMutableFunction } from "../../utils";

export type EmptyProps<Data = unknown> = {
  initialData?: Data;
} & ComponentProps;

export type EmptyMutable<Data = unknown> = {} & ComponentMutable<
  ComponentProps,
  Data
>;

export const empty = <Data>(
  originalProps: EmptyProps<Data> = {},
): InternalMutable<EmptyMutable<Data>, false> => {
  const { label = "empty", position, initialData } = originalProps;
  const $props = structuredClone(originalProps);

  let $id = `${label}_${getRandomNumber(0, 100_000)}`;
  let $position: Point = {
    x: position?.x || 0,
    y: position?.y || 0,
  };
  let $angle = 0;
  let $label = label;
  let $body: BodyMutable;
  let $data = initialData ?? ({} as Data);

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

  const getData = <R = Data>(selector?: (data: Data) => R): R => {
    return selector ? selector($data) : ($data as unknown as R);
  };
  const setData = (data: Data | ((data: Data) => Data)) => {
    if (typeof data === "function") {
      $data = (data as (data: Data) => Data)($data);
    } else {
      $data = data;
    }
  };

  const $getRaw = (): EmptyProps<Data> => ({
    id: $id,
    label: $label,
    position: getPosition(),
    angle: getAngle(),
    initialData: $data,
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

    getData,
    setData,

    getProps: () => $props as any,

    $destroy: () => {},
    $getRaw,

    $mutable: false,
  };
};
