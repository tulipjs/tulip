import { container } from "../";
import {
  Component,
  ContainerMutable,
  ContainerProps,
  Direction,
} from "../../types";
import { DisplayObjectEvent, Event } from "../../enums";
import { global } from "../../global";
import { degreesToRadians } from "../../utils";

type PlayerProps = {
  maxSpeed?: number;
  acceleration?: number;
  deceleration?: number;
  onTick?: (direction: Direction) => void; // TODO: change direction -> keybinding -> https://github.com/tulipjs/tulip/issues/53
} & ContainerProps;

export const player2D: Component<PlayerProps, ContainerMutable> = ({
  onTick = () => {},
  maxSpeed = 8,
  acceleration = 0.3,
  deceleration = 0.1,
  ...props
}) => {
  const $container = container({
    ...props,
  });

  let currentKeyList = [];
  let velocityX = 0;
  let velocityY = 0;

  $container.on(DisplayObjectEvent.TICK, () => {
    const position = $container.getPosition();
    global.sounds.setPosition({ ...position, z: 2 });
    const $body = $container.getBody();
    if (!$body) return;

    const angle = degreesToRadians($container.getAngle());

    if (currentKeyList.includes("d")) {
      velocityX -= acceleration * Math.cos(angle);
      velocityY -= acceleration * Math.sin(angle);

      onTick(Direction.RIGHT);
    } else if (currentKeyList.includes("a")) {
      velocityX += acceleration * Math.cos(angle);
      velocityY += acceleration * Math.sin(angle);

      onTick(Direction.LEFT);
    } else if (currentKeyList.includes("w")) {
      velocityX -= acceleration * Math.sin(angle);
      velocityY += acceleration * Math.cos(angle);

      onTick(Direction.UP);
    } else if (currentKeyList.includes("s")) {
      velocityX += acceleration * Math.sin(angle);
      velocityY -= acceleration * Math.cos(angle);

      onTick(Direction.DOWN);
    } else {
      if (velocityX > 0) {
        velocityX = Math.max(0, velocityX - deceleration);
      } else if (velocityX < 0) {
        velocityX = Math.min(0, velocityX + deceleration);
      }

      if (velocityY > 0) {
        velocityY = Math.max(0, velocityY - deceleration);
      } else if (velocityY < 0) {
        velocityY = Math.min(0, velocityY + deceleration);
      }
    }

    // Max speed
    const currentVelocity = Math.sqrt(
      velocityX * velocityX + velocityY * velocityY,
    );
    if (currentVelocity > maxSpeed) {
      const scalingFactor = maxSpeed / currentVelocity;
      velocityX *= scalingFactor;
      velocityY *= scalingFactor;
    }
    $body.setVelocity({ x: velocityX, y: velocityY });

    // Rotation
    if (currentKeyList.includes("q")) {
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
