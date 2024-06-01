import * as PIXI from "pixi.js";
import {
  Component,
  Container,
  DisplayObject,
  DisplayObjectMutable,
  DisplayObjectProps,
} from "../types";
import { getDisplayObjectMutable, setDisplayObjectProps } from "../utils";

export type ContainerProps = {} & DisplayObjectProps;

export type ContainerMutable = {
  add: (displayObjectMutable: DisplayObjectMutable<DisplayObject>) => void;
  remove: (displayObjectMutable: DisplayObjectMutable<DisplayObject>) => void;
} & DisplayObjectMutable<Container>;

export const containerComponent: Component<ContainerProps, ContainerMutable> = (
  props,
) => {
  const container = new PIXI.Container() as Container;
  setDisplayObjectProps<Container>(container, props);

  return {
    ...getDisplayObjectMutable<Container>(container),
    //
    add: (displayObjectMutable) =>
      container.addChild(displayObjectMutable.getDisplayObject()),
    remove: (displayObjectMutable) =>
      container.removeChild(displayObjectMutable.getDisplayObject()),
  };
};
