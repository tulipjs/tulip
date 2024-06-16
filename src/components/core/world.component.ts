import p2 from "p2";
import {
  DisplayObject,
  DisplayObjectMutable,
  Component,
  WorldMutable,
  WorldProps,
  InternalMutable,
} from "../../types";
import { container } from "./container.component";
import { createTicker } from "../../utils";
import { WORLD_DEFAULT_PROPS } from "../../consts";

export const world: Component<WorldProps, WorldMutable, false> = (
  originalProps = WORLD_DEFAULT_PROPS,
) => {
  const {
    gravity = WORLD_DEFAULT_PROPS.gravity,
    velocity = WORLD_DEFAULT_PROPS.velocity,
    ...props
  } = originalProps;

  const $props = structuredClone(originalProps);

  const {
    add: addContainer,
    remove: removeContainer,
    ...componentMutable
  } = container(props);

  let displayObjectList: DisplayObjectMutable<any>[] = [];

  const $world = new p2.World({
    gravity: gravity ? [gravity.x, gravity.y] : undefined,
  });

  // const planeShape = new p2.Plane();
  // const planeBody = new p2.Body({ position: [0, -200] });
  // planeBody.addShape(planeShape);
  // _world.addBody(planeBody);

  // const material = new p2.Material();

  const add = (displayObject: DisplayObjectMutable<DisplayObject>) => {
    const body = displayObject.getBody();

    displayObjectList.push(displayObject);

    if (!body) {
      console.warn(
        `No body available on display object '${displayObject.getLabel()}'`,
      );
    } else {
      const _body = body.getBody();
      // for (const shape of _body.shapes) shape.material = material;
      $world.addBody(_body);

      // _world.addContactMaterial(
      //   new p2.ContactMaterial(material, material, { restitution: 1 }),
      // );
    }

    addContainer(displayObject);
  };

  const remove = (displayObject: DisplayObjectMutable<DisplayObject>) => {
    displayObjectList = displayObjectList.filter(
      (_, index) => displayObjectList.indexOf(displayObject) !== index,
    );
    const body = displayObject.getBody();
    if (body) $world.removeBody(body.getBody());

    removeContainer(displayObject);
  };

  createTicker(componentMutable.getDisplayObject(), ({ deltaTime }) => {
    if (!displayObjectList.length) return;

    $world.step(deltaTime / velocity);
  });

  const getComponent = (component: Component<any, any>) => {
    componentMutable.$componentName = mutable.$componentName = component.name;
    return mutable;
  };

  const $destroy = () => {
    componentMutable.$destroy();
    $world.clear();
  };

  const mutable: InternalMutable<WorldMutable, false> = {
    ...componentMutable,
    add,
    remove,
    // @ts-ignore
    getComponent,

    getProps: () => $props as any,

    $destroy,
  };

  return mutable;
};
