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

  const $container = new PIXI.Container() as Container;
  const emptyMutable = empty(originalProps);

  let childList: DisplayObjectMutable<any>[] = [];

  const displayObjectMutable = await initDisplayObjectMutable<Container>(
    $container,
    emptyMutable,
  );

  const $$destroy = displayObjectMutable.$destroy;
  const $$setBody = displayObjectMutable.setBody;

  const $destroy = () => {
    //remove child first
    $container?.parent?.removeChild($container);
    $$destroy();
    //destroy pixi container
    $container.destroy();
    displayObjectMutable.getFather = () => null;

    for (const childComponent of childList) childComponent.$destroy();
  };

  const add = (...displayObjectsMutable: DisplayObjectMutable<any>[]) => {
    for (const currentDisplayObjectMutable of displayObjectsMutable) {
      currentDisplayObjectMutable.getFather = () => displayObjectMutable;

      $container.addChild(
        currentDisplayObjectMutable.getDisplayObject({
          __preventWarning: true,
        }),
      );
      childList.push(currentDisplayObjectMutable);
      global.$addComponent(currentDisplayObjectMutable);
    }
  };

  const remove = (...displayObjectsMutable: DisplayObjectMutable<any>[]) => {
    displayObjectsMutable.forEach((displayObjectMutable) => {
      displayObjectMutable.getFather = () => null;

      $container.removeChild(
        displayObjectMutable.getDisplayObject({ __preventWarning: true }),
      );
      childList = childList.filter((child) => child !== displayObjectMutable);
      global.$removeComponent(displayObjectMutable);
    });
  };

  const getChildren = () => childList;

  const setBody = async (body: BodyMutable) => {
    await $$setBody(body);

    if (global.$isVisualHitBoxes()) {
      const shapes = body.$getShapes();
      add(
        ...(await Promise.all(
          shapes.map(async ({ props }) => await getVisualShape(props)),
        )),
      );
    }
  };

  return displayObjectMutable.getComponent<
    InternalMutable<ContainerMutable, false>
  >(container as any, {
    //
    add,
    remove,
    getChildren,

    setBody,

    getProps: () => $props as any,

    $destroy,

    $mutable: false,
  });
};
