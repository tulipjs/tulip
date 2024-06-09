import { application } from "@darkaqua/tulip";
import { appComponent } from "app.component";
import { initViteTulipPlugin } from "@darkaqua/vite-tulip";

application({
  backgroundColor: 0xff00ff,
  scale: 1,
}).then(async ({ add }) => {
  add(await appComponent());
});

if (import.meta)
  initViteTulipPlugin(import.meta.hot, (componentModule, componentData) => {
    console.log(componentModule, componentData);
  });
