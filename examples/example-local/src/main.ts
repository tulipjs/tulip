import { application, ContainerMutable, global } from "@darkaqua/tulip";
import { appComponent } from "app.component";

application({
  backgroundColor: 0xff00ff,
  scale: 1,
  importMetaHot: import.meta.hot,
}).then(async ({ add }) => {
  add(await appComponent());

  setInterval(() => {
    console.info(global.getFPS());
  }, 1000);
});
