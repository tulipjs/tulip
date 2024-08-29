import { GlobalEventsType, GlobalWindowType } from "./global.types";
import { ApplicationMutable } from "./application.types";

export type CursorLoadProps = {
  getApplication: () => ApplicationMutable;
  normalizeValue: (value: number) => number;
  events: GlobalEventsType;
  window: GlobalWindowType;
};
