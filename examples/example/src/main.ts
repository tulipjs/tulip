import { application, global } from "@tulib/tulip";
import { appComponent } from "app.component";
import { GlobalData } from "types";
import { tooltipComponent } from "tooltip.component";

const app = application({
  backgroundColor: 0x030303,
  scale: 4,
  pixelPerfect: true,
  showFPS: false,
  //@ts-ignore
  importMetaEnv: import.meta.env,
  //@ts-ignore
  importMetaHot: import.meta.hot,
  // pointerLock: true,
  safeArea: false,
  resize: false,
  width: 200,
  height: 100,
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
  await global.spriteSheets.load({
    spriteSheet: [
      "fonts/default-font.json",
      "fonts/default-font-bold.json",
      "fighter/fighter.json",
      "chat.json",
    ],

    onLoad: async (spriteSheet) => {
      console.log(`${performance.now()} Loading... ${spriteSheet}`);
    },
  });
  await global.textures.load({
    textures: ["chat.png"],
    onLoad: async (spriteSheet) => {
      console.log(`${performance.now()} Loading... ${spriteSheet}`);
    },
  });
  global.tooltip.setComponent((tooltip) => tooltipComponent({ tooltip }));

  app.add(appComponent());
});
