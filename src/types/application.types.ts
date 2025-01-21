import * as PIXI from "pixi.js";
import { DisplayObjectMutable } from "./components";
import { WindowMutable } from "./window.types";
import { ScaleMode } from "../enums";
import { Size } from "./size.types";

export type ApplicationProps = {
  // Development
  importMetaEnv?: any;
  importMetaHot?: any;

  backgroundColor?: number;
  scale?: number;
  showFPS?: boolean;
  pointerLock?: boolean;
  pixelPerfect?: boolean;
  scaleMode?: ScaleMode;
  safeArea?: boolean;

  enableWebGPU?: boolean;

  resize?: boolean;
  width?: number;
  height?: number;

  contextMenuDisabled?: boolean;

  appendCanvasFunc?: (canvas: HTMLCanvasElement) => void;
};

export type ApplicationMutable = {
  load: (load: () => Promise<void> | void) => void;

  add: (displayObjectMutable: DisplayObjectMutable<any>) => void;
  remove: (displayObjectMutable: DisplayObjectMutable<any>) => void;

  start: () => void;
  stop: () => void;

  isPixelPerfect: () => boolean;
  getScale: () => number;
  getScaleMode: () => ScaleMode;
  getFPS: () => number;
  isSafeArea: () => boolean;
  itResizes: () => boolean;

  getSize: () => Size;

  getCanvas: () => HTMLCanvasElement;

  $getApplication: () => PIXI.Application;

  window: WindowMutable;
};
