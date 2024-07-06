import * as PIXI from "pixi.js";
import {
  ApplicationProps,
  PartialContainerMutable,
  PartialTextMutable,
} from "./types";
import { APPLICATION_DEFAULT_PROPS } from "./consts";
import { global } from "./global";
import { initViteTulipPlugin } from "@tulib/vite-tulip-plugin";
import { Event } from "./enums";
import { text } from "./components";

export const application = async ({
  backgroundColor = APPLICATION_DEFAULT_PROPS.backgroundColor,
  scale = APPLICATION_DEFAULT_PROPS.scale,
  importMetaEnv = null,
  importMetaHot = null,
  showFPS = APPLICATION_DEFAULT_PROPS.showFPS,
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

  // ticker
  application.ticker.autoStart = false;
  application.ticker.stop();

  let $isStopped = false;
  let $lastUpdate = 0;

  let $frames = 0;
  let $prevTime = 0;
  let $textFPS: PartialTextMutable;

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

  const resize = () => {
    const { innerWidth, innerHeight } = window;

    application.canvas.style.width = `${Math.round(innerWidth)}px`;
    application.canvas.style.height = `${Math.round(innerHeight)}px`;

    application.renderer.resize(
      (innerWidth * devicePixelRatio) / scale,
      (innerHeight * devicePixelRatio) / scale,
    );
    application.renderer.resolution = scale * Math.round(devicePixelRatio);
  };
  window.addEventListener("resize", resize);
  resize();

  document.body.appendChild(application.canvas);
  global.$setApplication(application);

  //### DOCUMENT #####################################################################################################//

  document.addEventListener("keydown", (event: KeyboardEvent) =>
    global.events.$emit(Event.KEY_DOWN, event),
  );
  document.addEventListener("keyup", (event: KeyboardEvent) =>
    global.events.$emit(Event.KEY_UP, event),
  );

  //### DEVELOPMENT ##################################################################################################//
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
            const father = mutable.getFather() as PartialContainerMutable;

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
  //### MUTABLES #####################################################################################################//
  const mutable = {
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
  };

  return mutable;
};
