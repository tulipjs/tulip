import { ComponentMutable, GlobalFilterType } from "./types";

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

  const $getComponentList = ({ componentName }: GlobalFilterType = {}) =>
    componentList.filter(
      ({ $componentName }) =>
        !componentName || componentName === $componentName,
    );

  return {
    $addComponent,
    $removeComponent,
    $getComponentList,
  };
})();
