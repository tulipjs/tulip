import {
  AsyncComponent,
  circle,
  Container,
  container,
  DisplayObjectEvent,
  DisplayObjectMutable,
  EventMode,
  global,
  plane,
  sprite,
  world,
} from "@tulib/tulip";
import { flyComponent } from "fly.component";
import { player } from "../../../src/components/prefabs/player.component";

type Mutable = {} & DisplayObjectMutable<Container>;

export const appComponent: AsyncComponent<unknown, Mutable> = async () => {
  const $container = container({ label: "app" });
  const $world = world({
    position: { x: 0, y: 0 },
    label: "world",
    props: {
      physics: {
        enabled: true,
        gravity: { x: 0, y: -0.25 },
      },
    },
  });

  // setTimeout(() => {
  //   $world.setPhysicsEnabled(true);
  //   setTimeout(() => {
  //     $world.setPhysicsEnabled(false);
  //   }, 1000);
  // }, 1000);

  const $plane = plane({
    position: {
      x: 0,
      y: 100,
    },
    angle: 60,
    props: {
      color: 0x333333,
    },
    alpha: 0.25,
  });
  $world.add($plane);

  const $plane2 = plane({
    position: {
      x: 400,
      y: 200,
    },
    angle: -60,
    props: {
      color: 0x333333,
    },
    alpha: 0.25,
  });
  $world.add($plane2);

  for (let i = 0; i < 10; i++) {
    const _fly = flyComponent({
      label: `ball`,
      props: {
        color: 0,
        size: 4,
        mass: 10,
      },
      position: {
        x: 250 + i * 5,
        y: 0,
      },
    });
    $world.add(_fly);
  }

  $container.add($world);

  // const $inv = inventoryComponent();

  const $duck = await sprite({
    texture: "duck.png",
    eventMode: EventMode.STATIC,
  });
  $duck.setPosition({ x: 256, y: 100 });
  $duck.setPivot({ x: 128, y: 128 });
  const $quack = await $duck.addSound("quack", {
    sources: ["quack.mp3"],
    pannerConfig: {
      distanceModel: "inverse",
      rolloffFactor: 0.5,
    },
    $verbose: false,
  });

  $container.add($duck);

  const $world2 = world({
    position: { x: 0, y: 0 },
    label: "world2",
    props: {
      physics: {
        enabled: true,
        gravity: { x: 0, y: -0.25 },
      },
    },
  });

  const $player = circle({
    props: {
      color: 0xff0000,
      mass: 2,
      size: 10,
    },
  });
  $player.setPosition({ x: 100, y: 50 });

  $world2.add($player);

  $duck.on(DisplayObjectEvent.CLICK, async () => {
    $quack.play();
  });

  let currentKeyList = [];
  $player.on(DisplayObjectEvent.TICK, () => {
    const body = $player.getBody();

    const position = $player.getPosition();
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

  global.sounds.setVolume(1);

  document.addEventListener("keydown", ({ key }) => {
    currentKeyList = [...new Set([...currentKeyList, key])];
  });
  document.addEventListener("keyup", ({ key }) => {
    currentKeyList = currentKeyList.filter((cKey) => cKey != key);
  });

  const $speaker = await sprite({
    texture: "speaker.png",
    eventMode: EventMode.STATIC,
  });
  $speaker.setPosition({ x: 500, y: 500 });
  $speaker.setPivot({ x: 16, y: 16 });
  $container.add($speaker);

  const $sound = await $speaker.addSound("speaker", {
    sources: ["sample.mp3"],
    volume: 1,
    pannerConfig: {
      coneInnerAngle: 60,
      coneOuterAngle: 180,
      coneOuterGain: 0.2,
    },
    orientation: {
      x: -1,
      y: 0,
      z: 0,
    },
  });

  $speaker.on(DisplayObjectEvent.CLICK, async () => {
    $sound.toggle();
  });

  $container.add($world2);

  const render = async () => {
    console.log("render player");
    const $s = await sprite({
      texture: "duck.png",
    });
    $s.setPivot({ x: 128, y: 128 });
    return $s;
  };

  const $player2 = await player({
    render,
    props: {
      mass: 0.5,
      size: 2,
    },
  });
  $player2.setPosition({ x: 400, y: 500 });
  $world2.add($player2);

  const $plane3 = plane({
    position: {
      x: 0,
      y: 600,
    },
    angle: 0,
    props: {
      color: 0xff00ff,
    },
    alpha: 0.5,
  });
  $world2.add($plane3);

  return $container.getComponent(appComponent);
};
