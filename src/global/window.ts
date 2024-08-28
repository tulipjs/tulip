import {
  ApplicationMutable,
  GlobalWindowType,
  WindowLoadProps,
} from "../types";

export const window = (): GlobalWindowType => {
  let $getApplication: () => ApplicationMutable;

  const load = ({ getApplication }: WindowLoadProps) => {
    $getApplication = getApplication;
  };

  const getBounds = () => $getApplication().window.getBounds();
  const getScale = () => $getApplication().getScale();
  const isPixelPerfect = () => $getApplication().isPixelPerfect();

  return {
    load,

    getBounds,
    getScale,
    isPixelPerfect,
  };
};
