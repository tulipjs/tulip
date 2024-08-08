import { ApplicationMutable } from "./application.types";
import {
  ComponentMutable,
  DisplayObjectMutable,
  Font,
  PartialDisplayObjectMutable,
} from "./components";
import { Point, Point3d } from "./point.types";
import { Event } from "../enums";
import { DisplayObject } from "./pixi.types";
import { SoundProps, Volume } from "./sound.types";
import { SpriteSheetsLoadProps } from "./sprite-sheets.types";
import { TexturesLoadProps } from "./textures.types";
import * as PIXI from "pixi.js";

export type GlobalFilterType = {
  componentName?: string;
};

export type GlobalEventsType = {
  on: (
    event: Event,
    callback: (data?: any) => void | Promise<void>,
    displayObjectComponent?: PartialDisplayObjectMutable<DisplayObject>,
  ) => () => void;
  $remove: (event: Event, callbackId: number) => void;
  $emit: (event: Event, data?: any) => void;
};

export type GlobalSoundsType = {
  setPosition: (position: Point3d) => void;
  setOrientation: (orientation: Point3d) => void;
  getVolume: () => Volume;
  setVolume: (volume: number) => void;

  $load: () => void;
  $add: (props: SoundProps) => Promise<Howl>;
};

export type GlobalContextType = {
  $load: () => void;
  $add: (...componentMutable: DisplayObjectMutable<any>[]) => void;
  $remove: (...componentMutable: DisplayObjectMutable<any>[]) => void;

  add: (...componentMutable: DisplayObjectMutable<any>[]) => void;
  set: (...componentMutable: DisplayObjectMutable<any>[]) => void;
  remove: (...componentMutable: DisplayObjectMutable<any>[]) => void;
  get: () => DisplayObjectMutable<any>[];
  has: (...componentMutable: DisplayObjectMutable<any>[]) => boolean;
  clear: () => void;

  onNoContext: (callback: () => void | Promise<void>) => () => void;
};

export type GlobalSpriteSheetsType = {
  load: (props: SpriteSheetsLoadProps) => Promise<void>;
  get: (spriteSheet: string) => PIXI.Spritesheet;
};

export type GlobalTexturesType = {
  load: (props: TexturesLoadProps) => Promise<void>;
  loadRaw: (key: string, texture: string) => Promise<void>;
  get: (texture: string) => PIXI.Texture;
};

export type GlobalType = {
  $load: () => void;

  getFPS: () => number;

  setData: <Data extends {}>(data: Data | ((data: Data) => Data)) => void;
  getData: <Data extends {}>(selector?: (data: Data) => Data) => Data;

  getApplication: () => ApplicationMutable;

  setFonts: (fonts: Font[]) => Promise<void>;

  normalizeValue: (value: number) => number;
  normalizePoint: (point: Point) => Point;

  $setApplication: (application: ApplicationMutable) => void;

  $addComponent: (component: ComponentMutable) => void;
  $removeComponent: (component: ComponentMutable) => void;
  $getComponentList: (filter?: GlobalFilterType) => ComponentMutable[];

  $isVisualHitBoxes: () => boolean;
  $setVisualHitBoxes: (visual: boolean) => void;

  events: GlobalEventsType;
  sounds: GlobalSoundsType;
  context: GlobalContextType;
  spriteSheets: GlobalSpriteSheetsType;
  textures: GlobalTexturesType;
};
