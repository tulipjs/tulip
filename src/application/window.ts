import { ApplicationMutable, Size, WindowMutable } from "../types";
import { global } from "../global";
import { Env, Event } from "../enums";

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
    const application = $application.$getApplication();

    const $safePadding = {
      left: global.envs.get(Env.SAFE_AREA_INSET_LEFT),
      top: global.envs.get(Env.SAFE_AREA_INSET_TOP),
      right: global.envs.get(Env.SAFE_AREA_INSET_RIGHT),
      bottom: global.envs.get(Env.SAFE_AREA_INSET_BOTTOM),
    };

    const safeWidth = $safePadding.left + $safePadding.right;
    const safeHeight = $safePadding.top + $safePadding.bottom;

    application.renderer.resolution = scale * Math.round(devicePixelRatio);
    application.canvas.style.display = "absolute";
    application.canvas.style.left = `${$safePadding.left}px`;
    application.canvas.style.top = `${$safePadding.top}px`;
    application.canvas.style.width = `${Math.round(width * scale - safeWidth)}px`;
    application.canvas.style.height = `${Math.round(height * scale - safeHeight)}px`;

    application.renderer.resize(width - safeWidth, height - safeHeight);

    global.events.$emit(Event.RESIZE, getBounds());
  };

  const $load = () => {
    $application = global.getApplication();

    $window.addEventListener("resize", $resize);
    $resize();
    global.events.on(Event.SAFE_AREA_INSET_LEFT, $resize);
    global.events.on(Event.SAFE_AREA_INSET_TOP, $resize);
    global.events.on(Event.SAFE_AREA_INSET_RIGHT, $resize);
    global.events.on(Event.SAFE_AREA_INSET_BOTTOM, $resize);
  };

  return {
    $load,

    getBounds,
  };
};
