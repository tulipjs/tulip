import { application, global } from "@tulib/tulip";
import { appComponent } from "app.component";
import { GlobalData } from "types";

const app = application({
  backgroundColor: 0x030303,
  scale: 2,
  pixelPerfect: true,
  showFPS: true,
  //@ts-ignore
  importMetaEnv: import.meta.env,
  //@ts-ignore
  importMetaHot: import.meta.hot,
  // pointerLock: true,
});

app.load(async () => {
  global.$setVisualHitBoxes(false);
  global.setData<GlobalData>({ ballColor: 0x333333 });

  await global.setFonts([
    {
      src: "fonts/pixel.ttf",
      alias: "Pixel",
    },
  ]);
  await global.spriteSheets.load(
    "fonts/default-font.json",
    "fonts/default-font-bold.json",
    "fighter/fighter.json",
  );
  // await global.textures.load("duck.png");

  app.add(appComponent());
});
