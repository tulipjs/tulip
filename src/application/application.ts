import * as PIXI from "pixi.js";
import {
  ApplicationMutable,
  ApplicationProps,
  ContainerMutable,
  DisplayObjectMutable,
  TextMutable,
} from "../types";
import { APPLICATION_DEFAULT_PROPS, EVENT_MAP } from "../consts";
import { global } from "../global";
import { initViteTulipPlugin } from "@tulib/vite-tulip-plugin";
import { Event } from "../enums";
import { text } from "../components";
import { window } from "./window";

export const application = ({
  backgroundColor = APPLICATION_DEFAULT_PROPS.backgroundColor,
  scale = APPLICATION_DEFAULT_PROPS.scale,
  importMetaEnv = null,
  importMetaHot = null,
  showFPS = APPLICATION_DEFAULT_PROPS.showFPS,
  pointerLock = APPLICATION_DEFAULT_PROPS.pointerLock,
  pixelPerfect = APPLICATION_DEFAULT_PROPS.pixelPerfect,
  scaleMode = APPLICATION_DEFAULT_PROPS.scaleMode,
  enableWebGPU = APPLICATION_DEFAULT_PROPS.enableWebGPU,
}: ApplicationProps = APPLICATION_DEFAULT_PROPS): ApplicationMutable => {
  const application = new PIXI.Application();
  const $window = window();

  const load = async (onLoad: () => Promise<void> | void) => {
    await application.init({
      backgroundColor,
      antialias: true,
      sharedTicker: false,
      preference: enableWebGPU ? "webgpu" : "webgl",
    });

    //### APPLICATION ##################################################################################################//
    application.stage.sortableChildren = true;
    application.stage.eventMode = "static";

    //TODO #104
    // ticker
    application.ticker.autoStart = false;
    application.ticker.stop();

    // Renders crisp pixel sprites
    PIXI.TextureSource.defaultOptions.scaleMode = scaleMode;
    // PIXI.settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = true;
    PIXI.AbstractRenderer.defaultOptions.failIfMajorPerformanceCaveat = true;

    //TODO #104
    if (pointerLock) {
      application.canvas.addEventListener("click", () => {
        application.canvas.requestPointerLock();
      });
    }

    //### DOCUMENT #####################################################################################################//

    document.body.appendChild(application.canvas);

    for (const [nativeEvent, customEvent] of EVENT_MAP)
      document.addEventListener(nativeEvent, (event: KeyboardEvent) => {
        event.preventDefault();
        event.stopPropagation();
        global.events.$emit(customEvent, event);
      });

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
    start();
    $window.$load();
    global.$load();
    onLoad();
  };

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
  const stop = () => {
    $isStopped = true;
  };

  const add = (displayObjectMutable: DisplayObjectMutable<any>) => {
    displayObjectMutable.getFather = () => mutable as any;

    global.$addComponent(displayObjectMutable);
    application.stage.addChild(
      displayObjectMutable.getDisplayObject({ __preventWarning: true }),
    );
  };

  const remove = (displayObjectMutable: DisplayObjectMutable<any>) => {
    displayObjectMutable.getFather = null;

    global.$removeComponent(displayObjectMutable);
    application.stage.removeChild(
      displayObjectMutable.getDisplayObject({ __preventWarning: true }),
    );
  };

  const isPixelPerfect = () => pixelPerfect;
  const getScale = () => scale;
  const getScaleMode = () => scaleMode;

  //### MUTABLES #####################################################################################################//
  const mutable: ApplicationMutable = {
    load,

    add,
    remove,

    start,
    stop,

    isPixelPerfect,
    getScale,
    getScaleMode,

    $getApplication: () => application,

    window: $window,
  };

  global.$setApplication(mutable);

  return mutable;
};
