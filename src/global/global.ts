import { ComponentMutable, GlobalFilterType } from "../types";
import * as PIXI from "pixi.js";
import { events } from "./events";
import { sounds } from "./sounds";

export const global = (() => {
  let $application: PIXI.Application;
  let $data = {};
  let $componentList: ComponentMutable[] = [];
  const $sounds = sounds();
  $sounds.$load();
  let $visualHitboxes = false;

  const getFPS = (): number => $application.ticker.FPS;

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

  const getApplication = () => $application;

  const $addComponent = (component: ComponentMutable) => {
    $componentList.push(component);
  };
  const $removeComponent = (component: ComponentMutable) => {
    $componentList = $componentList.filter(
      ($component) => $component.getId() !== component.getId(),
    );
  };

  const $getComponentList = ({ componentName }: GlobalFilterType = {}) =>
    $componentList.filter(
      ({ $componentName }) =>
        !componentName || componentName === $componentName,
    );

  const $isVisualHitboxes = () => $visualHitboxes;
  const $setVisualHitboxes = (visual: boolean) => ($visualHitboxes = visual);

  return {
    getFPS,

    setData,
    getData,

    getApplication,

    $setApplication,

    $addComponent,
    $removeComponent,
    $getComponentList,

    $isVisualHitboxes,
    $setVisualHitboxes,

    events: events(),
    sounds: $sounds,
  };
})();
