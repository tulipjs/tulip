import { container } from "../";
import {
  AsyncComponent,
  ContainerMutable,
  ContainerProps,
  Direction,
} from "../../types";
import { DisplayObjectEvent, Event } from "../../enums";
import { global } from "../../global";

type PlayerProps = {
  onTick?: (direction: Direction) => void; // TODO: change direction -> keybinding
} & ContainerProps;

export const player2D: AsyncComponent<PlayerProps, ContainerMutable> = async ({
  onTick = () => {},
  ...props
}) => {
  const $container = container({
    ...props,
  });

  let currentKeyList = [];
  $container.on(DisplayObjectEvent.TICK, () => {
    const position = $container.getPosition();
    global.sounds.setPosition({ ...position, z: 2 });
    const $body = $container.getBody();

    if (currentKeyList.includes("d")) {
      $body.addForceX(-1);
      onTick(Direction.RIGHT);
    } else if (currentKeyList.includes("a")) {
      $body.addForceX(1);
      onTick(Direction.LEFT);
    } else if (currentKeyList.includes("w")) {
      $body.addForceY(1);
      onTick(Direction.UP);
    } else if (currentKeyList.includes("s")) {
      $body.addForceY(-1);
      onTick(Direction.DOWN);
    } else if (currentKeyList.includes("q")) {
      $container.setAngle((a) => a - 3);
    } else if (currentKeyList.includes("e")) {
      $container.setAngle((a) => a + 3);
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

  return $container.getComponent(player2D);
};
