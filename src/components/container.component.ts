import * as PIXI from "libs/pixi.mjs";
import { Component, Container, MutableFunction, Point } from "types";
import { EventMode } from "enums";
import { getValueMutableFunction } from "utils";

export type ContainerProps = {
  id?: string;
  label?: string;
  position?: Point;
  pivot?: Point;
  eventMode?: EventMode;
};

export type ContainerMutable = {
  //position
  setPosition: (position: MutableFunction<Point>) => void;
  setPositionX: (x: MutableFunction<number>) => void;
  setPositionY: (y: MutableFunction<number>) => void;
  getPosition: () => Point;
  //pivot
  setPivot: (pivot: MutableFunction<Point>) => void;
  setPivotX: (x: MutableFunction<number>) => void;
  setPivotY: (y: MutableFunction<number>) => void;
  getPivot: () => Point;
};

export const CONTAINER_DEFAULT_PROPS: ContainerProps = {
  position: { x: 0, y: 0 },
  pivot: { x: 0, y: 0 },
  eventMode: EventMode.NONE,
};

export const setContainerProps = (container: PIXI.Container, {
  id,
  label,
  position = CONTAINER_DEFAULT_PROPS.position,
  pivot = CONTAINER_DEFAULT_PROPS.pivot,
  eventMode = CONTAINER_DEFAULT_PROPS.eventMode,
}: ContainerProps = CONTAINER_DEFAULT_PROPS) => {
  id && (container.id = id);
  label && (container.label = label);

  position && container.position.copyFrom(position);
  pivot && container.pivot.copyFrom(pivot);
  console.log(container.position);

  eventMode && (container.eventMode = eventMode);
};

export const getContainerMutable = (container: PIXI.Container) => ({
  //position
  setPosition: async (data) =>
    container.position = await getValueMutableFunction<number>(
      data,
      container.position,
    ),
  setPositionX: async (data) =>
    container.position.x = await getValueMutableFunction<number>(
      data,
      container.position.x,
    ),
  setPositionY: async (data) =>
    container.position.y = await getValueMutableFunction<number>(
      data,
      container.position.y,
    ),
  getPosition: () => container.position,
  //pivot
  setPivot: async (data) =>
    container.pivot = await getValueMutableFunction<number>(
      data,
      container.position,
    ),
  setPivotX: async (data) =>
    container.pivot.x = await getValueMutableFunction<number>(
      data,
      container.position.x,
    ),
  setPivotY: async (data) =>
    container.pivot.y = await getValueMutableFunction<number>(
      data,
      container.position.y,
    ),
  getPivot: () => container.pivot,
});

export const containerComponent: Component<
  Container,
  ContainerProps,
  ContainerMutable
> = (props) => {
  const container = new PIXI.Container();
  setContainerProps(container, props);

  const mutable = {
    ...getContainerMutable(container),
  };

  return [container, mutable];
};
