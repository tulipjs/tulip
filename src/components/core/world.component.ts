import p2 from "p2";
import {
  ContainerComponent,
  PartialContainerMutable,
  DisplayObject,
  InternalContainerMutable,
  InternalDisplayObjectMutable,
  PartialWorldMutable,
  PartialWorldProps,
  WorldProps,
  WorldMutable,
} from "../../types";
import { container } from "./container.component";
import { WORLD_DEFAULT_PROPS } from "../../consts";
import { DisplayObjectEvent } from "../../enums";

export const world: ContainerComponent<WorldProps<{}>, WorldMutable> = async (
  originalProps = WORLD_DEFAULT_PROPS,
) => {
  const $container = await container(originalProps);

  const $props = structuredClone(originalProps);

  const { props = {} } = $container.getProps();
  const { physics } = props;

  let displayObjectList: InternalDisplayObjectMutable<
    DisplayObject,
    any,
    any,
    any
  >[] = [];

  let $world = new p2.World({
    gravity: physics?.gravity
      ? [physics?.gravity?.x || 0, physics?.gravity?.y || 0]
      : undefined,
  });

  const $addBody = (
    displayObject: InternalDisplayObjectMutable<DisplayObject, any, any, any>,
  ) => {
    const body = displayObject.getBody ? displayObject.getBody() : null;

    if (!body) {
      const children =
        (displayObject as PartialContainerMutable)?.getChildren() ?? [];
      for (const child of children) $addBody(child);
    } else {
      const _body = body.$getBody();

      //add contact materials
      for (const currentDisplayObject of [
        ...displayObjectList,
        displayObject,
      ]) {
        const displayObjectBody = currentDisplayObject.getBody();
        if (!displayObjectBody) continue;

        $world.addContactMaterial(body.$getContactBody(displayObjectBody));
      }
      $world.addBody(_body);
    }
  };

  const $$add = $container.add;
  const $$remove = $container.remove;
  const $$destroy = $container.$destroy;

  const add = (
    ...displayObjects: InternalDisplayObjectMutable<DisplayObject>[]
  ) => {
    displayObjects.forEach((displayObject) => {
      displayObjectList.push(displayObject);

      $addBody(displayObject);
      $$add(displayObject);
    });
  };

  const $removeBody = (
    displayObject: InternalDisplayObjectMutable<DisplayObject>,
  ) => {
    const body = displayObject.getBody ? displayObject.getBody() : null;
    if (body) $world.removeBody(body.$getBody());
    else {
      const children =
        (displayObject as InternalContainerMutable)?.getChildren() ?? [];
      for (const child of children)
        $removeBody(child as InternalDisplayObjectMutable<DisplayObject>);
    }
  };

  const remove = (
    ...displayObjects: InternalDisplayObjectMutable<DisplayObject>[]
  ) => {
    displayObjects.forEach((displayObject) => {
      displayObjectList = displayObjectList.filter(
        (_, index) => displayObjectList.indexOf(displayObject) !== index,
      );
      $removeBody(displayObject);
      $$remove(displayObject);
    });
  };

  const setPhysicsEnabled = (enabled: boolean) => {
    $container.setData({ physicsEnabled: enabled });
  };

  const getPhysicsEnabled = (): boolean =>
    $container.getData((data: { physicsEnabled: boolean }) =>
      data.physicsEnabled === undefined
        ? physics?.enabled === undefined || physics?.enabled
        : data.physicsEnabled,
    );
  setPhysicsEnabled(getPhysicsEnabled());

  $container.on<{ deltaTime: number }>(
    DisplayObjectEvent.TICK,
    ({ deltaTime }) => {
      if (!displayObjectList.length) return;

      getPhysicsEnabled() && $world.step(deltaTime * physics?.velocity || 1);
    },
  );

  const $destroy = () => {
    $$destroy();
    $world.clear();
  };

  const $getWorld = () => $world;

  const $mutable: Partial<
    InternalContainerMutable<PartialWorldProps, PartialWorldMutable, unknown>
  > &
    PartialWorldMutable = {
    add,
    remove,

    setPhysicsEnabled,
    getPhysicsEnabled,

    getProps: () => $props as any,

    $destroy,
    $getWorld,
  };

  return $container.getComponent(
    world,
    $mutable as InternalContainerMutable<
      PartialWorldProps,
      PartialWorldMutable,
      unknown
    >,
  );
};
