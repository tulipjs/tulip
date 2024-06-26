import p2 from "p2";
import {
  AsyncComponent,
  ContainerMutable,
  DisplayObject,
  DisplayObjectMutable,
  InternalMutable,
  WorldMutable,
  WorldProps,
} from "../../types";
import { container } from "./container.component";
import { WORLD_DEFAULT_PROPS } from "../../consts";
import { DisplayObjectEvent } from "../../enums";

export const world: AsyncComponent<WorldProps, WorldMutable, false> = async (
  originalProps = WORLD_DEFAULT_PROPS,
) => {
  const {
    add: addContainer,
    remove: removeContainer,
    ...componentMutable
  } = await container(originalProps);

  const $props = structuredClone(originalProps);

  const { props = {} } = componentMutable.getProps<WorldProps>();
  const { physics } = props;

  let displayObjectList: DisplayObjectMutable<any>[] = [];

  let $world = new p2.World({
    gravity: physics?.gravity
      ? [physics?.gravity?.x || 0, physics?.gravity?.y || 0]
      : undefined,
  });

  const $addBody = (displayObject: DisplayObjectMutable<DisplayObject>) => {
    const body = displayObject.getBody ? displayObject.getBody() : null;

    if (!body) {
      const children = (displayObject as ContainerMutable)?.getChildren() ?? [];
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

  const add = (...displayObjects: DisplayObjectMutable<DisplayObject>[]) => {
    displayObjects.forEach((displayObject) => {
      displayObjectList.push(displayObject);

      $addBody(displayObject);
      addContainer(displayObject);
    });
  };

  const $removeBody = (displayObject: DisplayObjectMutable<DisplayObject>) => {
    const body = displayObject.getBody ? displayObject.getBody() : null;
    if (body) $world.removeBody(body.$getBody());
    else {
      const children = (displayObject as ContainerMutable)?.getChildren() ?? [];
      for (const child of children) $removeBody(child);
    }
  };

  const remove = (...displayObjects: DisplayObjectMutable<DisplayObject>[]) => {
    displayObjects.forEach((displayObject) => {
      displayObjectList = displayObjectList.filter(
        (_, index) => displayObjectList.indexOf(displayObject) !== index,
      );
      $removeBody(displayObject);
      removeContainer(displayObject);
    });
  };

  const setPhysicsEnabled = (enabled: boolean) => {
    componentMutable.setData({ physicsEnabled: enabled });
  };

  const getPhysicsEnabled = (): boolean =>
    componentMutable.getData((data: { physicsEnabled: boolean }) =>
      data.physicsEnabled === undefined
        ? physics?.enabled === undefined || physics?.enabled
        : data.physicsEnabled,
    );
  setPhysicsEnabled(getPhysicsEnabled());

  componentMutable.on<{ deltaTime: number }>(
    DisplayObjectEvent.TICK,
    ({ deltaTime }) => {
      if (!displayObjectList.length) return;

      getPhysicsEnabled() && $world.step(deltaTime * physics?.velocity || 1);
    },
  );

  const $destroy = () => {
    componentMutable.$destroy();
    $world.clear();
  };

  const $getWorld = () => $world;

  return componentMutable.getComponent<InternalMutable<WorldMutable, false>>(
    world as any,
    {
      ...componentMutable,
      add,
      remove,
      setPhysicsEnabled,
      getPhysicsEnabled,

      getProps: () => $props as any,

      $destroy,
      $getWorld,
    },
  );
};
