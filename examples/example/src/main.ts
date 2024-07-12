import { application, global } from "@tulib/tulip";
import { appComponent } from "app.component";
import { GlobalData } from "types";

const app = application({
  backgroundColor: 0x030303,
  scale: 1,
  pixelPerfect: true,
  showFPS: true,
  //@ts-ignore
  importMetaEnv: import.meta.env,
  //@ts-ignore
  importMetaHot: import.meta.hot,
  // pointerLock: true,
  disabledZoom: true,
});

app.load(async () => {
  global.setData<GlobalData>({ ballColor: 0x333333 });

  await global.setFonts([
    {
      src: "fonts/pixel.ttf",
      alias: "Pixel",
    },
  ]);

  app.add(await appComponent());
});
