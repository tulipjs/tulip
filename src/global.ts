import { ComponentMutable, GlobalFilterType } from "./types";
import * as PIXI from "pixi.js";

export const global = (() => {
  let $application: PIXI.Application;
  let componentList: ComponentMutable[] = [];

  const $setApplication = (application: PIXI.Application) => $application = application
  
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

  const getFPS = (): number => $application.ticker.FPS
  
  return {
    $setApplication,
    
    getFPS,
    
    $addComponent,
    $removeComponent,
    $getComponentList,
  };
})();
