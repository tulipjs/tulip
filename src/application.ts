import * as PIXI from "pixi.js";
import { ApplicationProps, DisplayObject, DisplayObjectMutable } from "./types";
import { APPLICATION_DEFAULT_PROPS } from "./consts";
import { global } from "./global";

export const application = async ({
  backgroundColor = APPLICATION_DEFAULT_PROPS.backgroundColor,
  scale = APPLICATION_DEFAULT_PROPS.scale,
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

  application.stage.sortableChildren = true;
  application.stage.eventMode = "static";

  // Renders crisp pixel sprites
  PIXI.TextureSource.defaultOptions.scaleMode = "nearest";
  // PIXI.settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = true;
  PIXI.AbstractRenderer.defaultOptions.failIfMajorPerformanceCaveat = true;

  application.renderer.resolution = scale * Math.round(devicePixelRatio);

  document.body.appendChild(application.canvas);

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
