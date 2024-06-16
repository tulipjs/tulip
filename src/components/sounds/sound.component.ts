import { Howl } from "howler";
import { Component, SoundMutable, SoundProps } from "../../types";

// TODO: add position or SpatialAudio
export const sound: Component<SoundProps, SoundMutable> = ({
  source,
  volume = 0.5,
  loop = false,
}) => {
  const $sound = new Howl({
    src: [source],
    html5: true,
    autoplay: false,
    loop,
    volume,
    onloaderror: (soundId, soundError) => {
      console.error("[sound]", soundId, soundError);
    },
    onend: function () {
      console.log("Finished!");
    },
  });

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

    $mutable: true,
  };
};
