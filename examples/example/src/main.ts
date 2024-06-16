import { application, global } from "@tulib/tulip";
import { appComponent } from "app.component";
import { GlobalData } from "types";

application({
  backgroundColor: 0xcccfff,
  scale: 1,
  //@ts-ignore
  importMetaEnv: import.meta.env,
  importMetaHot: import.meta.hot,
}).then(async ({ add }) => {
  global.setData<GlobalData>({ ballColor: 0x333333 });

  add(await appComponent());

  setInterval(() => {
    // console.info(global.getFPS());
  }, 1000);
});
