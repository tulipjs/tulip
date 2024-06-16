import { ComponentMutable, GlobalFilterType } from "./types";
import * as PIXI from "pixi.js";

export const global = (() => {
  let $application: PIXI.Application;
  let $data = {};

  let componentList: ComponentMutable[] = [];

  const getFPS = (): number => $application.ticker.FPS;

  const isDevelopment = (): boolean => {
    //@ts-ignore
    if (!import.meta?.env) return false;

    //@ts-ignore
    const { DEV, PROD } = import.meta?.env;

    return DEV && !PROD;
  };

  const getData = <Data extends {}>(selector?: (data: Data) => Data): Data => {
    return selector ? selector($data as Data) : ($data as unknown as Data);
  };
  const setData = <Data extends {}>(data: Data | ((data: Data) => Data)) => {
    if (typeof data === "function") {
      $data = (data as (data: Data) => Data)($data as Data);
    } else {
      $data = data;
    }
  };

  const $setApplication = (application: PIXI.Application) =>
    ($application = application);

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
    getFPS,

    setData,
    getData,

    isDevelopment,

    $setApplication,

    $addComponent,
    $removeComponent,
    $getComponentList,
  };
})();
