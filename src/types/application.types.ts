import * as PIXI from "pixi.js";
import { DisplayObjectMutable } from "./display-object.types";

export type ApplicationProps = {
  backgroundColor?: number;
  scale?: number;
  importMetaEnv?: any;
  importMetaHot?: any;
  showFPS?: boolean;
  pointerLock?: boolean;
  pixelPerfect?: boolean;
};

export type ApplicationMutable = {
  add: (displayObjectMutable: DisplayObjectMutable<any>) => void;
  remove: (displayObjectMutable: DisplayObjectMutable<any>) => void;

  start: () => void;
  stop: () => void;

  isPixelPerfect: () => boolean;

  $getApplication: () => PIXI.Application;
};
