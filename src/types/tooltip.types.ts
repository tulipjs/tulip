import { GlobalEventsType } from "./global.types";
import { ApplicationMutable } from "./application.types";

export type TooltipLoadProps = {
  events: GlobalEventsType;
  getApplication: () => ApplicationMutable;
};
