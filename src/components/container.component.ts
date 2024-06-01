import * as PIXI from "../libs/pixi.mjs";
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
  addChild: (displayObjectMutable: DisplayObjectMutable<DisplayObject>) => void;
} & DisplayObjectMutable<Container>;

export const containerComponent: Component<
  ContainerProps,
  ContainerMutable
> = (props) => {
  const container = new PIXI.Container();
  setDisplayObjectProps(container, props);

  return {
    ...getDisplayObjectMutable(container),
    //
    addChild: (displayObjectMutable) =>
      container.addChild(displayObjectMutable.getDisplayObject()),
  };
};
