import * as PIXI from "pixi.js";
import {
  Component,
  Container,
  ContainerProps,
  ContainerMutable,
  InternalMutable,
  ComponentMutable,
} from "../types";
import { getDisplayObjectMutable, setDisplayObjectProps } from "../utils";
import { empty } from "./empty.component";
import { global } from "../global";

export const container: Component<ContainerProps, ContainerMutable, false> = (
  originalProps = {},
) => {
  const { label, ...props } = originalProps;

  const $props = structuredClone(originalProps);

  const container = new PIXI.Container() as Container;
  const emptyMutable = empty({ label, position: props.position });

  let childList: ComponentMutable[] = [];

  const displayObjectMutable = getDisplayObjectMutable<Container>(
    container,
    emptyMutable,
  );
  setDisplayObjectProps<Container>(container, props, displayObjectMutable);

  const $destroy = () => {
    //remove child first
    container?.parent?.removeChild(container);
    displayObjectMutable.$destroy();
    //destroy pixi container
    container.destroy();
    for (const childComponent of childList) childComponent.$destroy();
  };

  const mutable: InternalMutable<ContainerMutable, false> = {
    ...displayObjectMutable,
    //
    add: (displayObjectMutable) => {
      displayObjectMutable.getFather = () => mutable;

      container.addChild(displayObjectMutable.getDisplayObject());
      childList.push(displayObjectMutable);
      global.$addComponent(displayObjectMutable);
    },
    remove: (displayObjectMutable) => {
      displayObjectMutable.getFather = null;

      container.removeChild(displayObjectMutable.getDisplayObject());
      childList = childList.filter((child) => child !== displayObjectMutable);
      global.$removeComponent(displayObjectMutable);
    },
    // @ts-ignore
    getComponent: (component) => {
      mutable.$componentName = component.name;
      return mutable;
    },

    getProps: () => $props as any,

    $destroy,

    $mutable: false,
  };
  return mutable;
};
