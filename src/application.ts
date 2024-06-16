import * as PIXI from "pixi.js";
import {
  ApplicationProps,
  ContainerMutable,
  DisplayObject,
  DisplayObjectMutable,
} from "./types";
import { APPLICATION_DEFAULT_PROPS } from "./consts";
import { global } from "./global";
import { initViteTulipPlugin } from "@tulib/vite-tulip-plugin";
import { Event } from "./enums";

export const application = async ({
  backgroundColor = APPLICATION_DEFAULT_PROPS.backgroundColor,
  scale = APPLICATION_DEFAULT_PROPS.scale,
  importMetaEnv = null,
  importMetaHot = null,
}: ApplicationProps = APPLICATION_DEFAULT_PROPS) => {
  const application = new PIXI.Application();

  await application.init({
    backgroundColor,
    antialias: true,
    sharedTicker: false,
    resizeTo: window,
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
  const update = (currentUpdate: number) => {
    currentUpdate *= 0.01; // convert to ms
    let deltaTime = currentUpdate - $lastUpdate;
    $lastUpdate = currentUpdate;

    global.events.$emit(Event.TICK, { deltaTime });
    application.render();

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

  // {
  //   let $lastVisibleChange = 0;
  //   window.addEventListener("visibilitychange", (event) => {
  //     if (document.hidden) $lastVisibleChange = performance.now();
  //     else {
  //       console.log(document.hidden, performance.now() - $lastVisibleChange);
  //       for (let i = 0; i < 10000; i++) {
  //         PIXI.Ticker.shared.update();
  //       }
  //     }
  //   });
  // }

  // Renders crisp pixel sprites
  PIXI.TextureSource.defaultOptions.scaleMode = "nearest";
  // PIXI.settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = true;
  PIXI.AbstractRenderer.defaultOptions.failIfMajorPerformanceCaveat = true;

  application.renderer.resolution = scale * Math.round(devicePixelRatio);

  document.body.appendChild(application.canvas);
  global.$setApplication(application);

  //### DEVELOPMENT ##################################################################################################//
  if (importMetaEnv?.DEV) {
    //@ts-ignore
    window.__PIXI_DEVTOOLS__ = {
      pixi: PIXI,
      app: application,
    };

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
            const props = structuredClone(mutable.getProps<any>());
            const body = mutable.getBody();

            mutable.$destroy();

            global.$removeComponent(mutable);

            const component = await componentModule[componentData.funcName]({
              ...props,
              ...raw,
            });
            father.add(component);
            body && component.setBody(body);
          }
        },
      );
  }

  //### MUTABLES #####################################################################################################//
  const mutable = {
    add: (displayObjectMutable: DisplayObjectMutable<DisplayObject>) => {
      displayObjectMutable.getFather = () => mutable as any;

      global.$addComponent(displayObjectMutable);
      application.stage.addChild(displayObjectMutable.getDisplayObject());
    },
    remove: (displayObjectMutable: DisplayObjectMutable<DisplayObject>) => {
      displayObjectMutable.getFather = null;

      global.$removeComponent(displayObjectMutable);
      application.stage.removeChild(displayObjectMutable.getDisplayObject());
    },

    start,
    stop,
  };

  return mutable;
};
