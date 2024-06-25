import * as PIXI from "pixi.js";
import {
  AsyncComponent,
  BodyMutable,
  Container,
  ContainerMutable,
  ContainerProps,
  DisplayObjectMutable,
  InternalMutable,
} from "../../types";
import { initDisplayObjectMutable, getVisualShape } from "../../utils";
import { empty } from "./empty.component";
import { global } from "../../global";

export const container: AsyncComponent<
  ContainerProps,
  ContainerMutable,
  false
> = async (originalProps = {}) => {
  const $props = structuredClone(originalProps);

  const container = new PIXI.Container() as Container;
  const emptyMutable = empty(originalProps);

  let childList: DisplayObjectMutable<any>[] = [];

  const displayObjectMutable = await initDisplayObjectMutable<Container>(
    container,
    emptyMutable,
  );

  const $destroy = () => {
    //remove child first
    container?.parent?.removeChild(container);
    displayObjectMutable.$destroy();
    //destroy pixi container
    container.destroy();
    $mutable.getFather = null;

    for (const childComponent of childList) childComponent.$destroy();
  };

  const add = (...displayObjectsMutable: DisplayObjectMutable<any>[]) => {
    for (const displayObjectMutable of displayObjectsMutable) {
      displayObjectMutable.getFather = () => $mutable;

      container.addChild(displayObjectMutable.getDisplayObject());
      childList.push(displayObjectMutable);
      global.$addComponent(displayObjectMutable);
    }
  };

  const remove = (...displayObjectsMutables: DisplayObjectMutable<any>[]) => {
    displayObjectsMutables.forEach((displayObjectMutable) => {
      displayObjectMutable.getFather = null;

      container.removeChild(displayObjectMutable.getDisplayObject());
      childList = childList.filter((child) => child !== displayObjectMutable);
      global.$removeComponent(displayObjectMutable);
    });
  };

  const getChildren = () => childList;

  const setBody = async (body: BodyMutable) => {
    await displayObjectMutable.setBody(body);

    if (global.$isVisualHitBoxes()) {
      const shapes = body.$getShapes();
      await Promise.all(
        shapes.map(async ({ props }) => add(await getVisualShape(props))),
      );
    }
  };

  const getComponent = (component) => {
    emptyMutable.getComponent(component);
    return $mutable;
  };

  const $mutable: InternalMutable<ContainerMutable, false> = {
    ...displayObjectMutable,
    //
    add,
    remove,
    getChildren,

    //@ts-ignore
    getComponent,

    setBody,

    getProps: () => $props as any,

    $destroy,

    $mutable: false,
  };
  return $mutable;
};
