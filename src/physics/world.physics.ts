import p2 from "p2";
import { DisplayObjectMutable, World } from "../types";

export const world: World = ({ gravity } = {}) => {
  let displayObjectList: DisplayObjectMutable<any>[] = [];

  const _world = new p2.World({
    gravity: gravity ? [gravity.x, gravity.y] : undefined,
  });

  const add = <DisplayObject>(
    displayObject: DisplayObjectMutable<DisplayObject>,
  ) => {
    const body = displayObject.getBody();
    if (!body)
      console.warn(
        `No body available on display object '${displayObject.getLabel()}'`,
      );
    else {
      displayObjectList.push(displayObject);
      _world.addBody(body.getBody());
    }

    const planeShape = new p2.Plane();
    const planeBody = new p2.Body({ position: [0, -200] });
    planeBody.addShape(planeShape);
    _world.addBody(planeBody);
  };

  const remove = <DisplayObject>(
    displayObject: DisplayObjectMutable<DisplayObject>,
  ) => {
    displayObjectList = displayObjectList.filter(
      (_, index) => displayObjectList.indexOf(displayObject) !== index,
    );
    const body = displayObject.getBody();
    if (body) _world.removeBody(body.getBody());
  };

  const _step = () => {
    _world.step(1 / 80);
    for (const displayObject of displayObjectList) displayObject?._step();
  };

  return {
    add,
    remove,

    _step,
  };
};
