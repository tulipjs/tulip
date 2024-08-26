import * as PIXI from "pixi.js";
import {
  BodyMutable,
  Container,
  DisplayObject,
  ContainerProps,
  ContainerMutable,
  DisplayObjectMutable,
} from "../../types";
import { getVisualShape } from "../../utils";
import { global } from "../../global";
import { displayObject } from "./display-object.component";
import { DisplayObjectEvent } from "../../enums";

export const container = <Props = {}, Mutable = {}, Data = {}>(
  originalProps: ContainerProps<Props, Data> = {} as ContainerProps<
    Props,
    Data
  >,
): ContainerMutable<Props, Mutable, Data> => {
  const $displayObject = displayObject<Container, ContainerProps<Props>>({
    ...originalProps,
    displayObject: new PIXI.Container(),
  });

  let childList: DisplayObjectMutable<DisplayObject>[] = [];

  const $container = $displayObject.getDisplayObject({
    __preventWarning: true,
  });
  const $$destroy = $displayObject.$destroy;
  const $$setBody = $displayObject.setBody;

  const $destroy = () => {
    //remove child first
    $container?.parent?.removeChild($container);
    $$destroy();
    //destroy pixi container
    $container.destroy();
    $displayObject.getFather = () => null;

    for (const childComponent of childList) childComponent.$destroy();
  };

  const add = (
    ...displayObjectsMutable: DisplayObjectMutable<DisplayObject>[]
  ) => {
    for (const currentDisplayObjectMutable of displayObjectsMutable) {
      currentDisplayObjectMutable.getFather = () =>
        $displayObject as DisplayObjectMutable<DisplayObject, unknown, any>;

      $container.addChild(
        currentDisplayObjectMutable.getDisplayObject({
          __preventWarning: true,
        }),
      );
      childList.push(currentDisplayObjectMutable);
      global.$addComponent(currentDisplayObjectMutable);
      $container.emit(
        DisplayObjectEvent.ADD_CHILD,
        currentDisplayObjectMutable,
      );
    }
  };

  const remove = (
    ...displayObjectsMutable: DisplayObjectMutable<DisplayObject>[]
  ) => {
    displayObjectsMutable.forEach((displayObjectMutable) => {
      $container.emit(DisplayObjectEvent.REMOVE_CHILD, displayObjectMutable);

      displayObjectMutable.getFather = () => null;

      $container.removeChild(
        displayObjectMutable.getDisplayObject({ __preventWarning: true }),
      );
      childList = childList.filter((child) => child !== displayObjectMutable);
      global.$removeComponent(displayObjectMutable);
    });
  };

  const getChildren = () => childList;

  const setBody = (body: BodyMutable) => {
    $$setBody(body);

    if (global.$isVisualHitBoxes()) {
      const shapes = body.$getShapes();
      add(...shapes.map(({ props }) => getVisualShape(props)));
    }
  };

  const $mutable = {
    add,
    remove,
    getChildren,

    setBody,

    $destroy,
  } as ContainerMutable<Props, Mutable, Data>;

  return $displayObject.getComponent(container, $mutable);
};
