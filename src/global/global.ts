import {
  ComponentMutable,
  GlobalFilterType,
  Font,
  ApplicationMutable,
  Point,
  GlobalType,
} from "../types";
import * as PIXI from "pixi.js";
import { events } from "./events";
import { sounds } from "./sounds";
import { Assets } from "pixi.js";
import { context } from "./context";
import { spriteSheets } from "./spriteSheets";
import { textures } from "./textures";
import { window } from "./window";
import { cursor } from "./cursor";
import { envs } from "./envs";
import { tooltip } from "./tooltip";

export const global: GlobalType = (() => {
  let $application: ApplicationMutable;
  let $data = {};
  let $componentList: ComponentMutable[] = [];
  let $visualHitBoxes = false;

  const $events = events();
  const $context = context();
  const $sounds = sounds();
  const $spriteSheet = spriteSheets();
  const $textures = textures();
  const $window = window();
  const $cursor = cursor();
  const $envs = envs();
  const $tooltip = tooltip();

  const $load = () => {
    $events.load();
    $window.load({ getApplication });
    $envs.load({ events: $events, window: $window });
    $cursor.load({
      normalizeValue,
      getApplication,
      events: $events,
      window: $window,
    });
    $sounds.$load();
    $context.$load();
    $tooltip.load({ events: $events, getApplication });
  };

  const getFPS = (): number => $application.getFPS();

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

  const $setApplication = (application: ApplicationMutable) =>
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

  const $getComponentList = ({ componentName, id }: GlobalFilterType = {}) =>
    $componentList.filter(
      ({ $getComponentName, getId }) =>
        (!componentName || componentName === $getComponentName()) &&
        (!id || id === getId()),
    );

  const $isVisualHitBoxes = () => $visualHitBoxes;
  const $setVisualHitBoxes = (visual: boolean) => ($visualHitBoxes = visual);

  //TODO move to assets(?)
  const setFonts = async (fonts: Font[]) => {
    PIXI.Assets.reset();
    Assets.addBundle("fonts", fonts);
    await Assets.loadBundle("fonts", (progress) =>
      console.info(`[tulip] - loading fonts ${progress * 100}%`),
    );
  };

  //TODO Move to utils (?)
  const normalizeValue = (value: number): number =>
    getApplication()?.isPixelPerfect() ? Math.round(value) : value;
  const normalizePoint = (point: Point): Point => {
    return getApplication()?.isPixelPerfect?.()
      ? {
          x: Math.round(point.x),
          y: Math.round(point.y),
        }
      : point;
  };

  return {
    $load,

    getFPS,

    setData,
    getData,

    getApplication,

    setFonts,

    normalizeValue,
    normalizePoint,

    $setApplication,

    $addComponent,
    $removeComponent,
    $getComponentList,

    $isVisualHitBoxes,
    $setVisualHitBoxes,

    events: $events,
    sounds: $sounds,
    context: $context,
    spriteSheets: $spriteSheet,
    textures: $textures,
    window: $window,
    cursor: $cursor,
    envs: $envs,
    tooltip: $tooltip,
  };
})();
