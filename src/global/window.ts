import { ApplicationMutable } from "../types";

export const window = () => {
  let getApplication: () => ApplicationMutable;

  const load = ($getApplication: () => ApplicationMutable) => {
    getApplication = $getApplication;
  };

  const getBounds = () => getApplication().window.getBounds();
  const getScale = () => getApplication().getScale();
  const isPixelPerfect = () => getApplication().isPixelPerfect();

  return {
    load,

    getBounds,
    getScale,
    isPixelPerfect,
  };
};
