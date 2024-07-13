import { ApplicationMutable, Size, WindowMutable } from "../types";
import { global } from "../global";
import { Event } from "../enums";

export const window = (): WindowMutable => {
  const $window = globalThis.window;
  let $application: ApplicationMutable;

  const getBounds = (): Size => {
    const isPixelPerfect = $application.isPixelPerfect();
    const scale = $application.getScale();
    const { innerWidth, innerHeight } = $window;

    const _getOddExtra = (value: number): number =>
      isPixelPerfect ? (value % 2 === 1 ? 1 : 0) + value : value;
    return {
      width: _getOddExtra(Math.round(innerWidth / scale)),
      height: _getOddExtra(Math.round(innerHeight / scale)),
    };
  };

  const $resize = () => {
    const { width, height } = getBounds();
    const scale = $application.getScale();
    const disabledZoom = $application.isDisabledZoom();
    const application = $application.$getApplication();

    application.renderer.resolution = scale * Math.round(devicePixelRatio);
    application.canvas.style.width = `${width * scale}px`;
    application.canvas.style.height = `${height * scale}px`;

    application.renderer.resize(
      width * (disabledZoom ? devicePixelRatio : 1),
      height * (disabledZoom ? devicePixelRatio : 1),
    );

    global.events.$emit(Event.RESIZE, getBounds());
  };

  const $load = () => {
    $application = global.getApplication();

    $window.addEventListener("resize", $resize);
    $resize();
  };

  return {
    $load,

    getBounds,
  };
};
