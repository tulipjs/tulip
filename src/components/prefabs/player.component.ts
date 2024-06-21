import { container } from "../";
import {
  AsyncComponent,
  ContainerMutable,
  ContainerProps,
  Direction,
  InternalMutable,
} from "../../types";
import { DisplayObjectEvent, Event } from "../../enums";
import { global } from "../../global";

type PlayerProps = {
  render: (
    $container: InternalMutable<ContainerMutable, false>,
  ) => Promise<void>;
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
    } else if (currentKeyList.includes("q")) {
      $container.setAngle((a) => a - 2);
    } else if (currentKeyList.includes("e")) {
      $container.setAngle((a) => a + 2);
    }
  });

  const onKeyDown = ({ key }) => {
    currentKeyList = [...new Set([...currentKeyList, key])];
  };

  const onKeyUp = ({ key }) => {
    currentKeyList = currentKeyList.filter((cKey) => cKey != key);
  };

  global.events.on(Event.KEY_DOWN, onKeyDown, $container);
  global.events.on(Event.KEY_UP, onKeyUp, $container);

  return $container.getComponent(player);
};
