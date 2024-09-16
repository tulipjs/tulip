import { Event } from "../enums";

export const EVENT_MAP: [string, Event][] = [
  ["keydown", Event.KEY_DOWN],
  ["keyup", Event.KEY_UP],
  ["contextmenu", Event.RIGHT_CLICK],
  ["mousemove", Event.POINTER_MOVE],
  ["mousedown", Event.POINTER_DOWN],
  ["mouseup", Event.POINTER_UP],
  ["touchmove", Event.POINTER_MOVE],
  ["touchstart", Event.POINTER_DOWN],
  ["touchend", Event.POINTER_UP],
  ["wheel", Event.WHEEL],
  ["visibilitychange", Event.VISIBILITY_CHANGE],
];
