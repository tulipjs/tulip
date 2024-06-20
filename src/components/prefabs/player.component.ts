import { container } from "../";
import {
  AsyncComponent,
  ContainerMutable,
  ContainerProps,
  Direction,
  InternalMutable,
} from "../../types";
import { DisplayObjectEvent } from "../../enums";
import { global } from "../../global";

type PlayerProps = {
  render: ($container: InternalMutable<ContainerMutable, false>) => void;
  onMove?: (direction: Direction) => void; // TODO: change -> onTick -> keybinding
} & ContainerProps;

export const player: AsyncComponent<PlayerProps, ContainerMutable> = async ({
  render,
  onMove = () => {},
  ...props
}) => {
  const $container = container({
    ...props,
  });

  await render($container);

  let currentKeyList = [];
  $container.on(DisplayObjectEvent.TICK, () => {
    const position = $container.getPosition();
    global.sounds.setPosition({ ...position, z: 2 });
    const $body = $container.getBody();

    if (currentKeyList.includes("d")) {
      $body.addForceX(-1);
      onMove(Direction.RIGHT);
    } else if (currentKeyList.includes("a")) {
      $body.addForceX(1);
      onMove(Direction.LEFT);
    } else if (currentKeyList.includes("w")) {
      $body.addForceY(1);
      onMove(Direction.UP);
    } else if (currentKeyList.includes("s")) {
      $body.addForceY(-1);
      onMove(Direction.DOWN);
    }
  });

  const onKeyDown = ({ key }) => {
    currentKeyList = [...new Set([...currentKeyList, key])];
  };

  const onKeyUp = ({ key }) => {
    currentKeyList = currentKeyList.filter((cKey) => cKey != key);
  };

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  $container.on(DisplayObjectEvent.REMOVED, () => {
    document.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("keyup", onKeyUp);
  });

  return $container.getComponent(player);
};
