import { Point, Point3d } from "./point.types";

export type PannerConfig = {
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
  id: string;
  sources: string[];
  volume?: number;
  loop?: boolean;
  pannerConfig?: PannerConfig;
  orientation?: Point3d;

  $verbose?: boolean;
};

export type SoundMutable = {
  play: () => void;
  pause: () => void;
  stop: () => void;
  mute: () => void;
  loop: () => void;
  fade: () => void;
  toggle: () => void;

  getId: () => string;
  getVolume: () => number;
  getDuration: () => number;
  isPlaying: () => boolean;
  setPosition: (position: Point) => void;
};
