import p2 from "p2";
import {
  DisplayObject,
  WorldProps,
  WorldMutable,
  DisplayObjectMutable,
  ContainerMutable,
  WorldComponent,
} from "../../types";
import { container } from "./container.component";
import { WORLD_DEFAULT_PROPS } from "../../consts";
import { DisplayObjectEvent } from "../../enums";

export const world: WorldComponent = (originalProps = WORLD_DEFAULT_PROPS) => {
  const $container = container<WorldProps, WorldMutable>(originalProps);

  const { physics } = $container.getProps();

  let displayObjectList: DisplayObjectMutable<DisplayObject>[] = [];

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

  const $$add = $container.add;
  const $$remove = $container.remove;
  const $$destroy = $container.$destroy;

  const add = (...displayObjects: DisplayObjectMutable<DisplayObject>[]) => {
    displayObjects.forEach((displayObject) => {
      displayObjectList.push(displayObject);

      $addBody(displayObject);
      $$add(displayObject);
    });
  };

  const $removeBody = (displayObject: DisplayObjectMutable<DisplayObject>) => {
    const body = displayObject.getBody ? displayObject.getBody() : null;
    if (body) $world.removeBody(body.$getBody());
    else {
      const children = (displayObject as ContainerMutable)?.getChildren() ?? [];
      for (const child of children)
        $removeBody(child as DisplayObjectMutable<DisplayObject>);
    }
  };

  const remove = (...displayObjects: DisplayObjectMutable<DisplayObject>[]) => {
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

  const $mutable = {
    add,
    remove,

    setPhysicsEnabled,
    getPhysicsEnabled,

    $destroy,
    $getWorld,
  };

  return $container.getComponent(world, $mutable);
};
