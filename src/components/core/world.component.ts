import p2 from "p2";
import {
  Component,
  DisplayObject,
  DisplayObjectMutable,
  InternalMutable,
  WorldMutable,
  WorldProps,
} from "../../types";
import { container } from "./container.component";
import { WORLD_DEFAULT_PROPS } from "../../consts";
import { DisplayObjectEvent } from "../../enums";

export const world: Component<WorldProps, WorldMutable, false> = (
  originalProps = WORLD_DEFAULT_PROPS,
) => {
  const {
    add: addContainer,
    remove: removeContainer,
    ...componentMutable
  } = container(originalProps);

  const $props = structuredClone(originalProps);

  const {
    props: { physics },
  } = componentMutable.getProps<WorldProps>();

  let displayObjectList: DisplayObjectMutable<any>[] = [];

  let $world = new p2.World({
    gravity: physics?.gravity
      ? [physics?.gravity?.x || 0, physics?.gravity?.y || 0]
      : undefined,
  });

  const add = (...displayObjects: DisplayObjectMutable<DisplayObject>[]) => {
    displayObjects.forEach((displayObject) => {
      const body = displayObject.getBody();

      displayObjectList.push(displayObject);

      if (!body) {
        console.warn(
          `No body available on display object '${displayObject.getLabel()}'`,
        );
      } else {
        const _body = body.$getBody();

        //add contact materials
        for (const displayObject of displayObjectList) {
          const displayObjectBody = displayObject.getBody();
          if (!displayObjectBody) continue;

          $world.addContactMaterial(body.$getContactBody(displayObjectBody));
        }
        $world.addBody(_body);

        // _world.addContactMaterial(
        //   new p2.ContactMaterial(material, material, { restitution: 1 }),
        // );
      }

      addContainer(displayObject);
    });
  };

  const remove = (...displayObjects: DisplayObjectMutable<DisplayObject>[]) => {
    displayObjects.forEach((displayObject) => {
      displayObjectList = displayObjectList.filter(
        (_, index) => displayObjectList.indexOf(displayObject) !== index,
      );
      const body = displayObject.getBody();
      if (body) $world.removeBody(body.$getBody());

      removeContainer(displayObject);
    });
  };

  const setPhysicsEnabled = (enabled: boolean) => {
    componentMutable.setData({ physicsEnabled: enabled });
  };

  const $getPhysicsEnabled = (): boolean =>
    componentMutable.getData((data: { physicsEnabled: boolean }) =>
      data.physicsEnabled === undefined
        ? physics.enabled === undefined || physics.enabled
        : data.physicsEnabled,
    );
  setPhysicsEnabled($getPhysicsEnabled());

  componentMutable.on<{ deltaTime: number }>(
    DisplayObjectEvent.TICK,
    ({ deltaTime }) => {
      if (!displayObjectList.length) return;

      $getPhysicsEnabled() && $world.step(deltaTime * physics?.velocity || 1);
    },
  );

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
    setPhysicsEnabled,

    // @ts-ignore
    getComponent,

    getProps: () => $props as any,

    $destroy,
  };

  return mutable;
};
