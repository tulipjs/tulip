import * as PIXI from "pixi.js";
import {
  ApplicationProps,
  ContainerMutable,
  DisplayObject,
  DisplayObjectMutable,
} from "./types";
import { APPLICATION_DEFAULT_PROPS } from "./consts";
import { global } from "./global";
import { initViteTulipPlugin } from "@darkaqua/vite-tulip";

export const application = async ({
  backgroundColor = APPLICATION_DEFAULT_PROPS.backgroundColor,
  scale = APPLICATION_DEFAULT_PROPS.scale,
  importMetaHot = null,
}: ApplicationProps = APPLICATION_DEFAULT_PROPS) => {
  const application = new PIXI.Application();

  await application.init({
    backgroundColor,
    antialias: true,
    sharedTicker: true,
    resizeTo: window,
    preference: "webgpu",
  });

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
        // console.log(componentModule, componentData);
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

  application.stage.sortableChildren = true;
  application.stage.eventMode = "static";

  // Renders crisp pixel sprites
  PIXI.TextureSource.defaultOptions.scaleMode = "nearest";
  // PIXI.settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = true;
  PIXI.AbstractRenderer.defaultOptions.failIfMajorPerformanceCaveat = true;

  application.renderer.resolution = scale * Math.round(devicePixelRatio);

  document.body.appendChild(application.canvas);
  global.$setApplication(application);

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
  };

  return mutable;
};
