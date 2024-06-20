import { PannerConfig } from "../types";

export const DEFAULT_PANNER_CONFIG: PannerConfig = {
  coneInnerAngle: 360,
  coneOuterAngle: 360,
  coneOuterGain: 0,
  distanceModel: "inverse",
  maxDistance: 10000,
  refDistance: 10,
  rolloffFactor: 1,
  panningModel: "HRTF",
};
