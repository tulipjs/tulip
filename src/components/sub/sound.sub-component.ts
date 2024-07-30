import { Point, SoundMutable, SoundProps, SubComponent } from "../../types";
import { global } from "../../global";
import { DEFAULT_PANNER_CONFIG } from "../../consts";

export const sound: SubComponent<SoundProps, SoundMutable> = ({
  id,
  sources,
  volume = 0.5,
  loop = false,
  orientation,
  pannerConfig = DEFAULT_PANNER_CONFIG,
  $verbose = false,
}) => {
  let $id = id + "";
  let $sound;

  global.sounds
    .$add({
      id,
      sources,
      volume,
      loop,
      pannerConfig,
      $verbose,
    })
    .then((sound) => ($sound = sound));

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

  const $getSound = () => $sound;

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

    $getSound,
  };
};
