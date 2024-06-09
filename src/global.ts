import { ComponentMutable } from "./types";

export const global = (() => {
  let componentList: ComponentMutable[] = [];

  const $addComponent = (component: ComponentMutable) => {
    componentList.push(component);
  };
  const $removeComponent = (component: ComponentMutable) => {
    componentList = componentList.filter(
      ($component) => $component.getId() !== component.getId(),
    );
  };

  return {
    $addComponent,
    $removeComponent,
  };
})();
