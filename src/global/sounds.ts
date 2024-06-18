import { Howler } from "howler";
import { Point3d, SoundProps } from "../types";

export const sounds = () => {
  let lastPosition = { x: 0, y: 0, z: 2 };
  let lastOrientation = { x: 0, y: 0, z: -1 };
  let globalSoundList = [];

  const $reloadPosition = () => {
    Howler.pos(lastPosition.x, lastPosition.y, lastPosition.z);
  };
  const $reloadOrientation = () => {
    Howler.orientation(
      lastOrientation.x,
      lastOrientation.y,
      lastOrientation.z,

      0,
      1,
      0,
    );
  };

  const $load = () => {
    setOrientation({
      x: 0,
      y: 0,
      z: -1,
    });

    // TODO: add camera position event
    // events[SystemEventsE.on](Event.CAMERA_POSITION, (position) => {
    //   setPosition({
    //     x: position.x,
    //     y: position.y,
    //     z: 2,
    //   });
    // });
  };

  const setPosition = (position: Point3d) => {
    lastPosition = position;
    $reloadPosition();
  };

  const setOrientation = (orientation: Point3d) => {
    lastOrientation = orientation;
    $reloadOrientation();
  };

  const $getDB = (dataArray: Uint8Array) => {
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i] * dataArray[i];
    }
    let rms = Math.sqrt(sum / dataArray.length);
    return 20 * Math.log10(rms);
  };

  const getVolume = (): { left: number; right: number } => {
    return globalSoundList.reduce(
      (totalVolume, { analyserLeft, analyserRight }) => {
        let arrayLeft = new Uint8Array(analyserLeft.frequencyBinCount);
        let arrayRight = new Uint8Array(analyserRight.frequencyBinCount);

        analyserLeft.getByteFrequencyData(arrayLeft);
        analyserRight.getByteFrequencyData(arrayRight);

        return {
          left: Math.max(totalVolume.left, $getDB(arrayLeft)),
          right: Math.max(totalVolume.right, $getDB(arrayRight)),
        };
      },
      { left: 0, right: 0 },
    );
  };

  const $add = ({
    sources,
    loop = false,
    volume = 0.5,
    pannerConfig = DEFAULT_PANNER_CONFIG,
    $verbose = false,
  }: SoundProps): Promise<Howl> =>
    new Promise<Howl>((resolve) => {
      const sound = new Howl({
        src: sources,
        autoplay: false,
        volume,
        loop,

        onend: (soundId) => $verbose && console.log("[sound] - onEnd", soundId),
        onload: (soundId) =>
          $verbose && console.log("[sound] - onLoad", soundId),
        onplay: (soundId) =>
          $verbose && console.log("[sound] - onPlay", soundId),
        onloaderror: (soundId, soundError) =>
          $verbose &&
          console.error("[sound] - onLoadError ", soundId, soundError),
        onplayerror: (soundId, error) =>
          $verbose && console.error("[sound] - onPlayError", soundId, error),
      });

      if (sound.state() === "loaded") resolve(sound);
      sound.once("load", () => {
        $reloadPosition();
        $reloadOrientation();

        sound.pannerAttr({
          ...DEFAULT_PANNER_CONFIG,
          ...pannerConfig,
        });

        resolve(sound);
      });
      let soundListIndex;
      sound.on("play", () => {
        const audioContext = Howler.ctx;
        const splitter = audioContext.createChannelSplitter(2);
        const analyserLeft = audioContext.createAnalyser();
        const analyserRight = audioContext.createAnalyser();

        // Connect the sound source to the splitter
        // @ts-ignore
        sound._sounds[0]._node.connect(splitter);

        // Connect splitter outputs to the analysers
        splitter.connect(analyserLeft, 0);
        splitter.connect(analyserRight, 1);

        soundListIndex = globalSoundList.push({
          sound,
          analyserLeft,
          analyserRight,
        });
      });
      sound.on("end", () => {
        sources[soundListIndex] = null;
      });
    });

  const setVolume = (volume: number) => Howler.volume(volume);

  return {
    setPosition,
    setOrientation,
    getVolume,
    setVolume,

    $load,
    $add,
  };
};
