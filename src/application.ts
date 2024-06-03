import * as PIXI from "pixi.js";
import { ApplicationProps, DisplayObject, DisplayObjectMutable } from "./types";
import { APPLICATION_DEFAULT_PROPS } from "./consts";

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

  return {
    add: (displayObjectMutable: DisplayObjectMutable<DisplayObject>) => {
      application.stage.addChild(displayObjectMutable.getDisplayObject());
    },
  };
};
