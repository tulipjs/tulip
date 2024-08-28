import { Size } from "./size.types";
import { ApplicationMutable } from "./application.types";

export type WindowMutable = {
  $load: () => void;

  getBounds: () => Size;
};

export type WindowLoadProps = {
  getApplication: () => ApplicationMutable;
};
