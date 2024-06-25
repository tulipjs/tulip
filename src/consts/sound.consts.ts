import { PannerConfig } from "../types";
import { PannerDistanceModel, PannerPanningModel } from "../enums";

export const DEFAULT_PANNER_CONFIG: PannerConfig = {
  coneInnerAngle: 360,
  coneOuterAngle: 360,
  coneOuterGain: 0,
  distanceModel: PannerDistanceModel.INVERSE,
  maxDistance: 10000,
  refDistance: 10,
  rolloffFactor: 1,
  panningModel: PannerPanningModel.HRTF,
};
