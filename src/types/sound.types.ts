import { Point } from "./point.types";

export type SoundProps = {
  sources: string[];
  volume?: number;
  loop?: boolean;

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
  getVolume: () => number;
  getDuration: () => number;
  isPlaying: () => boolean;
  setPosition: (position: Point) => void;
};
