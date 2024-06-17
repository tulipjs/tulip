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

type Mutable = {} & DisplayObjectMutable<Container>;

export const appComponent: AsyncComponent<unknown, Mutable> = async () => {
  const $container = container({ label: "app" });
  const $world = world({
    position: { x: 0, y: 0 },
    label: "world",
    props: {
      physics: {
        enabled: true,
        gravity: { x: 0, y: 0 },
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

  // const $plane2 = plane({
  //   position: {
  //     x: 400,
  //     y: 200,
  //   },
  //   angle: -60,
  //   props: {
  //     color: 0x333333,
  //   },
  //   alpha: 0.25,
  // });
  // $world.add($plane2);

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

  // let selectedBall;
  // for (let y = 0; y < 5; y++) {
  //   for (let x = 0; x < 20; x++) {
  //     const isFirst = x === 19 && y === 0;
  //
  //     const _ball = ballComponent({
  //       label: `ball${x * y}`,
  //       color: isFirst ? 0x00ff00 : 0xffffff,
  //       size: 4,
  //     });
  //
  //     _ball.setPosition({ x: x * 5 + 100, y: y * 5 });
  //
  //     if (isFirst) selectedBall = _ball;
  //
  //     _world.add(_ball);
  //   }
  // }
  //
  // let currentKeyList = [];
  // createTicker(selectedBall.getDisplayObject(), () => {
  //   const body = selectedBall.getBody();
  //
  //   if (currentKeyList.includes("d")) {
  //     body.addForceX(-20);
  //   } else if (currentKeyList.includes("a")) {
  //     body.addForceX(20);
  //   } else if (currentKeyList.includes("w")) {
  //     body.addForceY(20);
  //   } else if (currentKeyList.includes("s")) {
  //     body.addForceY(-20);
  //   }
  // });
  //
  // document.addEventListener("keydown", ({ key }) => {
  //   currentKeyList = [...new Set([...currentKeyList, key])];
  // });
  // document.addEventListener("keyup", ({ key }) => {
  //   currentKeyList = currentKeyList.filter((cKey) => cKey != key);
  // });

  // const $inv = inventoryComponent();
  const $duck = await sprite({
    texture: "duck.png",
    eventMode: EventMode.STATIC,
  });
  $duck.setPositionX(500);
  const $quack = await $duck.addSound("quack", {
    sources: ["quack.mp3"],
    $verbose: false,
  });

  $container.add($duck);

  $container.add($world);

  const $player = circle({
    props: {
      color: 0xff0000,
      mass: 2,
      size: 5,
    },
  });

  const $music = circle({
    props: {
      color: 0x00ff00,
      mass: 2000000,
      size: 5,
    },
  });
  $music.setPosition({ x: 500, y: 300 });
  const $song = await $music.addSound("camp", {
    sources: ["campfire.mp3"],
    $verbose: true,
  });
  $world.add($music);

  $duck.on(DisplayObjectEvent.CLICK, async () => {
    $song.toggle();
    $quack.play();
  });
  let currentKeyList = [];
  $player.on(DisplayObjectEvent.TICK, () => {
    const body = $player.getBody();

    const position = $player.getPosition();
    global.sounds.setPosition({ ...position, z: 2 });

    if (currentKeyList.includes("d")) {
      body.addForceX(-0.5);
    } else if (currentKeyList.includes("a")) {
      body.addForceX(0.5);
    } else if (currentKeyList.includes("w")) {
      body.addForceY(0.5);
    } else if (currentKeyList.includes("s")) {
      body.addForceY(-0.5);
    }
  });

  global.sounds.setVolume(1);

  document.addEventListener("keydown", ({ key }) => {
    currentKeyList = [...new Set([...currentKeyList, key])];
  });
  document.addEventListener("keyup", ({ key }) => {
    currentKeyList = currentKeyList.filter((cKey) => cKey != key);
  });

  $world.add($player);

  return $container.getComponent(appComponent);
};
