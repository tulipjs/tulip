import {
  animatedSprite,
  AsyncComponent,
  body,
  Container,
  ContainerProps,
  DisplayObjectEvent,
  DisplayObjectMutable,
  EventMode,
  global,
  PlayStatus,
} from "@tulib/tulip";

type Props = {
  props: {
    color: number;
    size: number;
    mass: number;
  };
} & ContainerProps;

type Mutable = {} & DisplayObjectMutable<Container>;

export const playerComponent: AsyncComponent<Props, Mutable> = async (
  props,
) => {
  const $player = await animatedSprite({
    spriteSheet: "fighter/fighter.json",
    animation: "turnRight",
    eventMode: EventMode.NONE,
  });
  const $body = body({
    mass: 1,
  });
  $player.setBody($body);
  $player.setPivot({ x: 175 / 2, y: 226 / 2 });
  $player.setPosition({ x: 100, y: 50 });

  let currentKeyList = [];
  $player.on(DisplayObjectEvent.TICK, () => {
    const position = $player.getPosition();
    global.sounds.setPosition({ ...position, z: 2 });

    if (currentKeyList.includes("d")) {
      $body.addForceX(-1);
      $player.setAnimation("turnRight");
      $player.setPlayStatus(PlayStatus.PLAY_AND_STOP);
      return;
    } else if (currentKeyList.includes("a")) {
      $body.addForceX(1);
      $player.setAnimation("turnLeft");
      $player.setPlayStatus(PlayStatus.PLAY_AND_STOP);
      return;
    } else if (currentKeyList.includes("w")) {
      $body.addForceY(1);
    } else if (currentKeyList.includes("s")) {
      $body.addForceY(-1);
    }
    $player.setFrame(0);
  });

  const onKeyDown = ({ key }) => {
    currentKeyList = [...new Set([...currentKeyList, key])];
  };

  const onKeyUp = ({ key }) => {
    currentKeyList = currentKeyList.filter((cKey) => cKey != key);
  };

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  $player.on(DisplayObjectEvent.REMOVED, () => {
    document.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("keyup", onKeyUp);
  });

  return $player.getComponent(playerComponent);
};
