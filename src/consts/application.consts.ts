import { ApplicationProps } from "../types";
import { ScaleMode } from "../enums";

export const APPLICATION_DEFAULT_PROPS: ApplicationProps = {
  backgroundColor: 0xff00ff,
  scale: 3,
  showFPS: false,
  pointerLock: false,
  pixelPerfect: false,
  scaleMode: ScaleMode.NEAREST,
  enableWebGPU: false,
  safeArea: false,
};
