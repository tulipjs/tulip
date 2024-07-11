import * as PIXI from "pixi.js";
import {
  ApplicationMutable,
  ApplicationProps,
  ContainerMutable,
  Size,
  TextMutable,
} from "../types";
import { APPLICATION_DEFAULT_PROPS } from "../consts";
import { global } from "../global";
import { initViteTulipPlugin } from "@tulib/vite-tulip-plugin";
import { Event } from "../enums";
import { text } from "../components";

export const application = async ({
  backgroundColor = APPLICATION_DEFAULT_PROPS.backgroundColor,
  scale = APPLICATION_DEFAULT_PROPS.scale,
  importMetaEnv = null,
  importMetaHot = null,
  showFPS = APPLICATION_DEFAULT_PROPS.showFPS,
  pointerLock = APPLICATION_DEFAULT_PROPS.pointerLock,
  pixelPerfect = APPLICATION_DEFAULT_PROPS.pixelPerfect,
  disabledZoom = APPLICATION_DEFAULT_PROPS.disabledZoom,
}: ApplicationProps = APPLICATION_DEFAULT_PROPS) => {
  const application = new PIXI.Application();

  await application.init({
    backgroundColor,
    antialias: true,
    sharedTicker: false,
    preference: "webgpu",
  });

  //### APPLICATION ##################################################################################################//
  application.stage.sortableChildren = true;
  application.stage.eventMode = "static";

  //TODO #104
  // ticker
  application.ticker.autoStart = false;
  application.ticker.stop();

  let $isStopped = false;
  let $lastUpdate = 0;

  let $frames = 0;
  let $prevTime = 0;
  let $textFPS: TextMutable;

  const $calculateFPS = () => {
    $frames++;

    let time = (performance || Date).now();

    if (time >= $prevTime + 1000) {
      const fps = ($frames * 1000) / (time - $prevTime);
      $prevTime = time;
      $frames = 0;
      return Math.round(fps);
    }
  };

  const update = async (currentUpdate: number) => {
    currentUpdate *= 0.01; // convert to ms
    let deltaTime = currentUpdate - $lastUpdate;
    $lastUpdate = currentUpdate;

    global.events.$emit(Event.TICK, { deltaTime });
    application.render();

    // FPS
    if (showFPS) {
      const fps = $calculateFPS();
      if (fps) {
        if (!$textFPS) {
          $textFPS = await text({
            text: `${fps} fps`,
            font: "Pixel",
            color: 0xffffff,
            size: 25,
            position: {
              x: 10,
              y: 10,
            },
          });
          mutable.add($textFPS);
        }

        $textFPS.setText(`${fps} fps`);
      }
    }

    if (!$isStopped) requestAnimationFrame(update);
  };

  const start = () => {
    $isStopped = false;
    requestAnimationFrame(update);
  };
  start();
  const stop = () => {
    $isStopped = true;
  };

  // Renders crisp pixel sprites
  PIXI.TextureSource.defaultOptions.scaleMode = "nearest";
  // PIXI.settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = true;
  PIXI.AbstractRenderer.defaultOptions.failIfMajorPerformanceCaveat = true;

  //TODO #104
  const getWindowBounds = (): Size => {
    const { innerWidth, innerHeight } = window;

    const _getOddExtra = (value: number): number =>
      pixelPerfect ? (value % 2 === 1 ? 1 : 0) + value : value;
    return {
      width: _getOddExtra(Math.round(innerWidth / scale)),
      height: _getOddExtra(Math.round(innerHeight / scale)),
    };
  };

  //TODO #104
  const resize = () => {
    const { width, height } = getWindowBounds();
    application.renderer.resolution = scale * Math.round(devicePixelRatio);
    application.canvas.style.width = `${width * scale}px`;
    application.canvas.style.height = `${height * scale}px`;

    application.renderer.resize(
      width * (disabledZoom ? devicePixelRatio : 1),
      height * (disabledZoom ? devicePixelRatio : 1),
    );
  };
  window.addEventListener("resize", resize);
  resize();

  //TODO #104
  if (pointerLock) {
    application.canvas.addEventListener("click", () => {
      application.canvas.requestPointerLock();
    });
  }

  //### DOCUMENT #####################################################################################################//

  //TODO #104
  document.body.appendChild(application.canvas);
  document.addEventListener("keydown", (event: KeyboardEvent) =>
    global.events.$emit(Event.KEY_DOWN, event),
  );
  document.addEventListener("keyup", (event: KeyboardEvent) =>
    global.events.$emit(Event.KEY_UP, event),
  );
  document.addEventListener("keypress", (event: KeyboardEvent) =>
    global.events.$emit(Event.KEY_PRESS, event),
  );

  //### DEVELOPMENT ##################################################################################################//

  //TODO #104
  if (importMetaEnv?.DEV) {
    //@ts-ignore
    window.__PIXI_DEVTOOLS__ = {
      pixi: PIXI,
      app: application,
    };
    //@ts-ignore
    globalThis.__PIXI_APP__ = application;

    // @ts-ignore
    if (importMetaHot)
      initViteTulipPlugin(
        importMetaHot,
        async (componentModule, componentData) => {
          const componentList = global.$getComponentList({
            componentName: componentData.funcName,
          });

          for (const mutable of componentList) {
            const father = mutable.getFather() as ContainerMutable;

            const raw = structuredClone(mutable.$getRaw());
            const props = structuredClone(mutable.getProps());
            const body = mutable.getBody();

            mutable.$destroy();

            global.$removeComponent(mutable);

            const component = await componentModule[componentData.funcName]({
              ...props,
              ...raw,
            });
            father && father.add(component);
            body && component.setBody(body);
          }
        },
      );
  }

  const isPixelPerfect = () => pixelPerfect;
  //### MUTABLES #####################################################################################################//
  const mutable: ApplicationMutable = {
    add: (displayObjectMutable) => {
      displayObjectMutable.getFather = () => mutable as any;

      global.$addComponent(displayObjectMutable);
      application.stage.addChild(
        displayObjectMutable.getDisplayObject({ __preventWarning: true }),
      );
    },
    remove: (displayObjectMutable) => {
      displayObjectMutable.getFather = null;

      global.$removeComponent(displayObjectMutable);
      application.stage.removeChild(
        displayObjectMutable.getDisplayObject({ __preventWarning: true }),
      );
    },

    start,
    stop,

    isPixelPerfect,

    $getApplication: () => application,
  };

  global.$setApplication(mutable);

  return mutable;
};
