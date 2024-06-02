import * as PIXI from "pixi.js";
import {
  Function,
  Container,
  DisplayObject,
  DisplayObjectMutable,
  DisplayObjectProps,
} from "../types";
import { getDisplayObjectMutable, setDisplayObjectProps } from "../utils";
import { empty } from "./empty.component";

export type ContainerProps = {} & DisplayObjectProps;

export type ContainerMutable = {
  add: (displayObjectMutable: DisplayObjectMutable<DisplayObject>) => void;
  remove: (displayObjectMutable: DisplayObjectMutable<DisplayObject>) => void;
} & DisplayObjectMutable<Container>;

export const container: Function<ContainerProps, ContainerMutable> = ({
  label,
  ...props
} = {}) => {
  const emptyMutable = empty({ label });

  const container = new PIXI.Container() as Container;
  setDisplayObjectProps<Container>(container, props);

  return {
    ...getDisplayObjectMutable<Container>(container, emptyMutable),
    //
    add: (displayObjectMutable) =>
      container.addChild(displayObjectMutable.getDisplayObject()),
    remove: (displayObjectMutable) =>
      container.removeChild(displayObjectMutable.getDisplayObject()),
  };
};
