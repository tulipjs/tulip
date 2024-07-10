import * as PIXI from "pixi.js";
import {
  BodyMutable,
  Container,
  DisplayObject,
  ContainerProps,
  ContainerMutable,
  DisplayObjectMutable,
} from "../../types";
import { initDisplayObjectMutable, getVisualShape } from "../../utils";
import { empty } from "./empty.component";
import { global } from "../../global";

export const container = async <Props = {}, Mutable = {}, Data = {}>(
  originalProps: ContainerProps<Props, Data> = {} as ContainerProps<
    Props,
    Data
  >,
): Promise<ContainerMutable<Props, Mutable, Data>> => {
  const $props = structuredClone(originalProps);

  const $container = new PIXI.Container() as Container;
  const emptyMutable = empty<Props, Mutable, Data>(originalProps);

  let childList: DisplayObjectMutable<DisplayObject>[] = [];

  const displayObjectMutable = await initDisplayObjectMutable<Container>(
    $container,
    //@ts-ignore
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

  const add = (
    ...displayObjectsMutable: DisplayObjectMutable<DisplayObject>[]
  ) => {
    for (const currentDisplayObjectMutable of displayObjectsMutable) {
      currentDisplayObjectMutable.getFather = () =>
        displayObjectMutable as DisplayObjectMutable<
          DisplayObject,
          unknown,
          any
        >;

      $container.addChild(
        currentDisplayObjectMutable.getDisplayObject({
          __preventWarning: true,
        }),
      );
      childList.push(currentDisplayObjectMutable);
      global.$addComponent(currentDisplayObjectMutable);
    }
  };

  const remove = (
    ...displayObjectsMutable: DisplayObjectMutable<DisplayObject>[]
  ) => {
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

  const $mutable: ContainerMutable<any, any, any> = {
    add,
    remove,
    getChildren,

    setBody,

    getProps: () => $props as Props,

    $destroy,

    $mutable: false,
  };

  return displayObjectMutable.getComponent(container, $mutable);
};
