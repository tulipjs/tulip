import * as PIXI from "pixi.js";
import {
  Function,
  Container,
  ContainerProps,
  ContainerMutable,
} from "../types";
import { getDisplayObjectMutable, setDisplayObjectProps } from "../utils";
import { empty } from "./empty.component";

export const container: Function<ContainerProps, ContainerMutable> = ({
  label,
  ...props
} = {}) => {
  const container = new PIXI.Container() as Container;
  const emptyMutable = empty({ label, position: props.position });

  const displayObjectMutable = getDisplayObjectMutable<Container>(
    container,
    emptyMutable,
  );
  setDisplayObjectProps<Container>(container, props, displayObjectMutable);

  return {
    ...getDisplayObjectMutable<Container>(container, emptyMutable),
    //
    add: (displayObjectMutable) =>
      container.addChild(displayObjectMutable.getDisplayObject()),
    remove: (displayObjectMutable) =>
      container.removeChild(displayObjectMutable.getDisplayObject()),
  };
};
