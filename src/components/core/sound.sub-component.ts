import {
  AsyncSubComponent,
  Point,
  SoundMutable,
  SoundProps,
} from "../../types";
import { global } from "../../global";

export const sound: AsyncSubComponent<SoundProps, SoundMutable> = async ({
  sources,
  volume = 0.5,
  loop = false,
  $verbose = false,
}) => {
  const $sound = await global.sounds.$add({
    sources,
    volume,
    loop,
    $verbose,
  });

  const setPosition = (position: Point) => {
    $sound.pos(position.x, position.y, 2);
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

    getVolume: () => $sound.volume(),
    getDuration: () => $sound.duration(),
    isPlaying: () => $sound.playing(),
    setPosition,
  };
};
