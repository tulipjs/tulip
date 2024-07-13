import { Size } from "./size.types";

export type WindowMutable = {
  $load: () => void;

  getBounds: () => Size;
};
