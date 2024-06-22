import * as PIXI from "pixi.js";
import {
  BodyMutable,
  Component,
  ComponentMutable,
  Container,
  ContainerMutable,
  ContainerProps,
  DisplayObjectMutable,
  InternalMutable,
} from "../../types";
import {
  getDisplayObjectMutable,
  getVisualShape,
  setDisplayObjectProps,
} from "../../utils";
import { empty } from "./empty.component";
import { global } from "../../global";

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

  const add = (displayObjectMutable: DisplayObjectMutable<any>) => {
    displayObjectMutable.getFather = () => mutable;

    container.addChild(displayObjectMutable.getDisplayObject());
    childList.push(displayObjectMutable);
    global.$addComponent(displayObjectMutable);
  };

  const remove = (displayObjectMutable: DisplayObjectMutable<any>) => {
    displayObjectMutable.getFather = null;

    container.removeChild(displayObjectMutable.getDisplayObject());
    childList = childList.filter((child) => child !== displayObjectMutable);
    global.$removeComponent(displayObjectMutable);
  };

  const setBody = (body: BodyMutable) => {
    displayObjectMutable.setBody(body);

    if (global.$isVisualHitboxes()) {
      const shapes = body.$getShapes();
      shapes.forEach(({ props }) => add(getVisualShape(props)));
    }
  };

  const mutable: InternalMutable<ContainerMutable, false> = {
    ...displayObjectMutable,
    //
    add,
    remove,
    // @ts-ignore
    getComponent: (component) => {
      mutable.$componentName = component.name;
      return mutable;
    },

    setBody,

    getProps: () => $props as any,

    $destroy,

    $mutable: false,
  };
  return mutable;
};
