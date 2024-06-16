import { application, global } from "@tulib/tulip";
import { appComponent } from "app.component";
import { GlobalData } from "types";

application({
  backgroundColor: 0xff00ff,
  scale: 1,
  //@ts-ignore
  $importMetaHot: import.meta.hot,
}).then(async ({ add }) => {
  global.setData<GlobalData>({ ballColor: 0x0000ff });

  add(await appComponent());

  setInterval(() => {
    console.info(global.getFPS());
  }, 1000);
});
