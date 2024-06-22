import {
  AsyncSubComponent,
  Point,
  SoundMutable,
  SoundProps,
} from "../../types";
import { global } from "../../global";
import { DEFAULT_PANNER_CONFIG } from "../../consts";

export const sound: AsyncSubComponent<SoundProps, SoundMutable> = async ({
  id,
  sources,
  volume = 0.5,
  loop = false,
  orientation,
  pannerConfig = DEFAULT_PANNER_CONFIG,
  $verbose = false,
}) => {
  let $id = id + "";

  const $sound = await global.sounds.$add({
    id,
    sources,
    volume,
    loop,
    pannerConfig,
    $verbose,
  });

  const setPosition = (position: Point) => {
    $sound.pos(position.x, position.y, 2);
    setOrientation();
  };

  const setOrientation = () => {
    if (!orientation) return;
    $sound.orientation(orientation.x, orientation.y, orientation.z);
  };

  const toggle = () => {
    if ($sound.playing()) {
      $sound.pause();
    } else {
      $sound.play();
    }
  };

  return {
    play: () => $sound.play(),
    pause: () => $sound.pause(),
    stop: () => $sound.stop(),
    mute: () => $sound.mute(),
    loop: () => $sound.loop(),
    fade: () => $sound.fade(1, 0, 500),
    toggle,

    getId: () => $id,
    getVolume: () => $sound.volume(),
    getDuration: () => $sound.duration(),
    isPlaying: () => $sound.playing(),
    setPosition,
  };
};
