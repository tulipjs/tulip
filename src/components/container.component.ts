import * as PIXI from "pixi.js";
import {
  Component,
  Container,
  ContainerProps,
  ContainerMutable, InternalMutable,
} from "../types";
import { getDisplayObjectMutable, setDisplayObjectProps } from "../utils";
import { empty } from "./empty.component";
import { global } from "../global";

export const container: Component<ContainerProps, ContainerMutable, false> = ({
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

  
  const mutable: InternalMutable<ContainerMutable, false>
    = {
    ...displayObjectMutable,
    //
    add: (displayObjectMutable) => {
      container.addChild(displayObjectMutable.getDisplayObject());
      global.$addComponent(displayObjectMutable);
    },
    remove: (displayObjectMutable) => {
      container.removeChild(displayObjectMutable.getDisplayObject());
      global.$removeComponent(displayObjectMutable);
    },
    $mutable: false,
    // @ts-ignore
    getComponent: (component) => {
      mutable.$componentName = component.name
      return mutable
    }
  };
  return mutable
};
