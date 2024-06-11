import {Howl, Howler} from 'howler';
import {ContainerMutable, ContainerProps, Function} from "../../types";

type SoundProps = {
  source: string
} & ContainerProps

export const sound: Function<SoundProps, ContainerMutable> = ({source}) => {

  const _sound = new Howl({
    src: [source],
    html5: true,
    autoplay: false,
    loop: false,
    volume: 0.5,
    onend: function() {
      console.log('Finished!');
    }
  });

  _sound.once('load', function(){
    // sound.play();
  });

  _sound.on('end', function(){
    console.log('Finished!');
  });

  const toggle = () => {
    if(_sound.playing()) {
      _sound.pause()
    } else {
      _sound.play()
    }
  }

  return {
    play: () => _sound.play(),
    pause: () => _sound.pause(),
    stop: () => _sound.stop(),
    mute: () => _sound.mute(),
    volume: () => _sound.volume(),
    loop: () => _sound.loop(),
    toggle,

    getDuration: () => _sound.duration(),
    isPlaying: () => _sound.playing(),
  }
};
