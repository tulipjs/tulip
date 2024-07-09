import {
  BodyMutable,
  Point,
  SoundProps,
  SoundMutable,
  InternalEmptyMutable,
  EmptyProps,
} from "../../types";
import { getRandomNumber, getValueMutableFunction } from "../../utils";
import { sound } from "./sound.sub-component";

export const empty = <Props, Mutable, Data>(
  originalProps = {} as EmptyProps<Data> & Props,
): InternalEmptyMutable<Props, Mutable, Data> => {
  const { label = "empty", position, angle, initialData } = originalProps;
  const $props = structuredClone(originalProps);

  let $id = originalProps.id || `${label}_${getRandomNumber(0, 100_000)}`;
  let $position: Point = {
    x: position?.x || 0,
    y: position?.y || 0,
  };
  let $angle = angle || 0;
  let $label = label;
  let $body: BodyMutable;
  let $data = (initialData ?? {}) as Data;
  let $soundList: SoundMutable[] = [];

  let $componentName;

  const getId = () => $id;

  const getLabel = () => $label;
  const setLabel = (label: string) => ($label = label);

  const getBody = () => $body;
  const setBody = async (body: BodyMutable) => {
    $body = body;
    $body.setPosition($position);
    $body.setAngle($angle);
  };

  const setPosition = async (data) => {
    $position = await getValueMutableFunction<Point>(data, $position);
    $body?.setPosition($position);

    $soundList.forEach(($sound) => $sound.setPosition($position));
  };
  const getPosition = () => $body?.getPosition() || $position;
  const setPositionX = async (data) => {
    $position.x = await getValueMutableFunction<number>(data, $position.x);
    $body?.setPosition($position);
    $soundList.forEach(($sound) => $sound.setPosition($position));
  };
  const setPositionY = async (data) => {
    $position.y = await getValueMutableFunction<number>(data, $position.y);
    $body?.setPosition($position);
    $soundList.forEach(($sound) => $sound.setPosition($position));
  };

  const getAngle = () => $body?.getAngle() || $angle;
  const setAngle = async (data) => {
    $angle = await getValueMutableFunction<number>(data, getAngle());
    $body?.setAngle($angle);
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

  const addSound = async (soundData: SoundProps) => {
    const $sound = await sound(soundData);
    $sound.setPosition(getPosition());
    $soundList.push($sound);
    return $sound;
  };
  const getSound = (soundId: string) =>
    $soundList.filter((sound) => sound.getId() === soundId);

  const $getRaw = () =>
    ({
      id: $id,
      label: $label,
      position: getPosition(),
      angle: getAngle(),
      initialData: $data,
    }) as Props;

  const getComponent = (component: Function, mutable: Object = {}) => {
    $componentName = component.name;

    for (const functionName of Object.keys(mutable))
      $mutable[functionName] = mutable[functionName];

    return $mutable;
  };
  const $getComponentName = () => $componentName || null;

  const $destroy = () => {
    $soundList.forEach(($sound) => $sound.stop());
  };

  const $mutable: InternalEmptyMutable<Props, unknown, Data> = {
    getId,

    getLabel,
    setLabel,

    setBody,
    getBody,

    //position
    setPosition,
    setPositionX,
    setPositionY,
    getPosition,

    getAngle,
    setAngle,

    getFather: null,

    getData,
    setData,

    addSound,
    getSound,

    getProps: () => $props as Props,

    //@ts-ignore
    getComponent,

    $destroy,
    $getRaw,

    $getComponentName,
    $mutable: false,
  };

  return $mutable as InternalEmptyMutable<Props, Mutable, Data>;
};
