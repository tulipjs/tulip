import * as PIXI from "libs/pixi.mjs";
import { app } from "app";

const load = async () => {
  const application = new PIXI.Application();

  await application.init({
    backgroundColor: 0xff00ff,
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

  document.body.appendChild(application.canvas);

  const [appContainer] = await app();
  application.stage.addChild(appContainer);
};
load();
