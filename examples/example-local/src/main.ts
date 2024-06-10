import { application, ContainerMutable, global } from "@darkaqua/tulip";
import { appComponent } from "app.component";
import { initViteTulipPlugin } from "@darkaqua/vite-tulip";

application({
  backgroundColor: 0xff00ff,
  scale: 1,
}).then(async ({ add }) => {
  add(await appComponent());
});

if (import.meta)
  initViteTulipPlugin(
    import.meta.hot,
    async (componentModule, componentData) => {
      const componentList = global.$getComponentList({
        componentName: componentData.funcName,
      });
      // console.log(componentModule, componentData);
      for (const mutable of componentList) {
        const father = mutable.getFather() as ContainerMutable;
        const props = structuredClone(mutable.$props);
        mutable.$destroy();

        father.add(await componentModule[componentData.funcName](props));
      }
    },
  );
