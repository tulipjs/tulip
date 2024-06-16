export type SoundProps = {
  source: string;
  volume: number;
  loop: boolean;
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
};
