import { Point, Point3D } from "./point.types";

type PannerConfig = {
  coneInnerAngle?: number | undefined;
  coneOuterAngle?: number | undefined;
  coneOuterGain?: number | undefined;
  distanceModel?: "inverse" | "linear";
  maxDistance?: number;
  panningModel?: "HRTF" | "equalpower";
  refDistance?: number;
  rolloffFactor?: number;
};

export type SoundProps = {
  sources: string[];
  volume?: number;
  loop?: boolean;
  pannerConfig?: PannerConfig;
  orientation?: Point3D;

  $verbose?: boolean;
};

export const DEFAULT_PANNER_CONFIG: PannerConfig = {
  coneInnerAngle: 360,
  coneOuterAngle: 360,
  coneOuterGain: 0,
  distanceModel: "inverse",
  maxDistance: 10000,
  refDistance: 10,
  rolloffFactor: 1,
  panningModel: "HRTF",
};

export type SoundMutable = {
  play: () => void;
  pause: () => void;
  stop: () => void;
  mute: () => void;
  loop: () => void;
  fade: () => void;
  toggle: () => void;
  getVolume: () => number;
  getDuration: () => number;
  isPlaying: () => boolean;
  setPosition: (position: Point) => void;
};
