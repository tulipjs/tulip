import p2 from "p2";
import {
  DisplayObject,
  DisplayObjectMutable,
  Component,
  WorldMutable,
  WorldProps,
} from "../../types";
import { container } from "../container.component";
import { createTicker } from "../../utils";
import { WORLD_DEFAULT_PROPS } from "../../consts";

export const world: Component<WorldProps, WorldMutable> = ({
  gravity = WORLD_DEFAULT_PROPS.gravity,
  velocity = WORLD_DEFAULT_PROPS.velocity,
  ...props
} = WORLD_DEFAULT_PROPS) => {
  const {
    add: addContainer,
    remove: removeContainer,
    ...componentMutable
  } = container(props);

  let displayObjectList: DisplayObjectMutable<any>[] = [];

  const _world = new p2.World({
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
      _world.addBody(_body);

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
    if (body) _world.removeBody(body.getBody());

    removeContainer(displayObject);
  };

  createTicker(componentMutable.getDisplayObject(), ({ deltaTime }) => {
    if (!displayObjectList.length) return;

    _world.step(deltaTime / velocity);
  });

  return {
    ...componentMutable,
    add,
    remove,
  };
};
