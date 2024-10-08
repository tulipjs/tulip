import {
  BodyMutable,
  Point,
  SoundProps,
  SoundMutable,
  ComponentProps,
  ComponentMutable,
  ApplicationMutable,
} from "../../types";
import { getRandomNumber, getValueMutableFunction } from "../../utils";
import { sound } from "../sub";
import { global } from "../../global";

export const component = <Props = {}, Mutable = {}, Data = {}>(
  originalProps: ComponentProps<Props, Data> = {} as ComponentProps<
    Props,
    Data
  >,
): ComponentMutable<ComponentProps<Props, Data>, Mutable, Data> => {
  const { label = "empty", position, angle, initialData } = originalProps;
  const $props = structuredClone(originalProps);

  let $id = originalProps.id || `${label}@@${getRandomNumber(0, 100_000)}`;
  let $position: Point = {
    x: position?.x || 0,
    y: position?.y || 0,
  };
  let $angle = angle || 0;
  let $label = label;
  let $body: BodyMutable;
  let $data = (initialData ?? {}) as Data;
  let $soundList: SoundMutable[] = [];
  let $fatherId = null;

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

  const setPosition = (data) => {
    $position = global.normalizePoint(
      getValueMutableFunction<Point>(data, $position),
    );
    $body?.setPosition($position);
    $soundList.forEach(($sound) => $sound.setPosition($position));
  };
  const getPosition = () => $body?.getPosition() || $position;
  const setPositionX = (data) => {
    $position.x = global.normalizeValue(
      getValueMutableFunction<number>(data, $position.x),
    );
    $body?.setPosition($position);
    $soundList.forEach(($sound) => $sound.setPosition($position));
  };
  const setPositionY = (data) => {
    $position.y = global.normalizeValue(
      getValueMutableFunction<number>(data, $position.y),
    );
    $body?.setPosition($position);
    $soundList.forEach(($sound) => $sound.setPosition($position));
  };

  const getAngle = () => $body?.getAngle() || $angle;
  const setAngle = (data) => {
    $angle = getValueMutableFunction<number>(data, getAngle());
    $body?.setAngle($angle);
  };

  const getFather = (): ComponentMutable | ApplicationMutable | null => {
    if (!$fatherId) return null;
    if ($fatherId === "stage") return global.getApplication();
    return global.$getComponentList({ id: $fatherId })[0] ?? null;
  };
  const $setFatherId = (fatherId: string) => {
    $fatherId = fatherId;
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

  const addSound = (soundData: SoundProps) => {
    const $sound = sound(soundData);
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

  const $mutable: ComponentMutable<Props, unknown, Data> = {
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

    getFather,
    $setFatherId,

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
    //@ts-ignore
    $expose: false,
  };

  return $mutable as ComponentMutable<Props, Mutable, Data>;
};
