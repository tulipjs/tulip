import { ComponentMutable, GlobalFilterType, Font } from "../types";
import * as PIXI from "pixi.js";
import { events } from "./events";
import { sounds } from "./sounds";
import { Assets } from "pixi.js";

export const global = (() => {
  let $application: PIXI.Application;
  let $data = {};
  let $componentList: ComponentMutable[] = [];
  const $sounds = sounds();
  $sounds.$load();
  let $visualHitBoxes = false;

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
      ({ $getComponentName }) =>
        !componentName || componentName === $getComponentName(),
    );

  const $isVisualHitBoxes = () => $visualHitBoxes;
  const $setVisualHitBoxes = (visual: boolean) => ($visualHitBoxes = visual);

  const setFonts = async (fonts: Font[]) => {
    PIXI.Assets.reset();
    Assets.addBundle("fonts", fonts);
    await Assets.loadBundle("fonts", (progress) =>
      console.info(`[tulip] - loading fonts ${progress * 100}%`),
    );
  };

  return {
    getFPS,

    setData,
    getData,

    getApplication,

    setFonts,

    $setApplication,

    $addComponent,
    $removeComponent,
    $getComponentList,

    $isVisualHitBoxes,
    $setVisualHitBoxes,

    events: events(),
    sounds: $sounds,
  };
})();
