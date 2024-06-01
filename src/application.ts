import * as PIXI from "./libs/pixi.mjs";
import { ApplicationProps, DisplayObject, DisplayObjectMutable } from "./types";

export const application = async (
  { backgroundColor, sharedTicker, antialias }: ApplicationProps,
) => {
  const application = new PIXI.Application();

  await application.init({
    backgroundColor,
    antialias,
    sharedTicker,
    resizeTo: window,
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

  application.renderer.resolution = Math.round(devicePixelRatio);

  document.body.appendChild(application.canvas);

  return {
    addChild: (displayObjectMutable: DisplayObjectMutable<DisplayObject>) => {
      application.stage.addChild(displayObjectMutable.getDisplayObject());
    },
  };
};
