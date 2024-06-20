import { body, container } from "../";
import {
  AsyncComponent,
  BodyMaterialProps,
  CircleProps,
  ContainerMutable,
  ContainerProps,
} from "../../types";
import { DisplayObjectEvent, Shape } from "../../enums";
import { global } from "../../global";

type PlayerProps = {
  render: () => any;
  props: {
    size: number;
    mass: number;
    material?: BodyMaterialProps;
  };
} & ContainerProps;

export const player: AsyncComponent<PlayerProps, ContainerMutable> = async ({
  render,
  ...props
}) => {
  const $container = container({
    ...props,
  });

  const {
    props: { mass, material },
  } = $container.getProps<CircleProps>();

  const spriteBody = body({
    mass,
    material,
  });
  spriteBody.addShape({
    type: Shape.BOX,
    width: 128,
    height: 128,
  });

  $container.setBody(spriteBody);

  $container.add(await render());

  let currentKeyList = [];
  $container.on(DisplayObjectEvent.TICK, () => {
    const body = $container.getBody();

    const position = $container.getPosition();
    global.sounds.setPosition({ ...position, z: 2 });

    if (currentKeyList.includes("d")) {
      body.addForceX(-1);
    } else if (currentKeyList.includes("a")) {
      body.addForceX(1);
    } else if (currentKeyList.includes("w")) {
      body.addForceY(1);
    } else if (currentKeyList.includes("s")) {
      body.addForceY(-1);
    }
  });

  document.addEventListener("keydown", ({ key }) => {
    currentKeyList = [...new Set([...currentKeyList, key])];
  });
  document.addEventListener("keyup", ({ key }) => {
    currentKeyList = currentKeyList.filter((cKey) => cKey != key);
  });

  return $container.getComponent(player);
};
