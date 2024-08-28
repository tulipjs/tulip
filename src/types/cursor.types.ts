import { GlobalEventsType, GlobalWindowType } from "./global.types";
import { ApplicationMutable } from "./application.types";

export type CursorLoadProps = {
  getApplication: () => ApplicationMutable;
  events: GlobalEventsType;
  window: GlobalWindowType;
};
