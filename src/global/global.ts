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

  const $load = () => {
    $window.load({ getApplication });
    $cursor.load({
      normalizeValue,
      getApplication,
      events: $events,
      window: $window,
    });
    $sounds.$load();
    $context.$load();
  };

  const getFPS = (): number => $application.$getApplication().ticker.FPS;

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

  const $getComponentList = ({ componentName }: GlobalFilterType = {}) =>
    $componentList.filter(
      ({ $getComponentName }) =>
        !componentName || componentName === $getComponentName(),
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
  };
})();
