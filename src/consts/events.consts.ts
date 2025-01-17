import { Event } from "../enums";

//eventName, Event, preventDefault
export const EVENT_MAP: [string, Event, boolean][] = [
  ["keydown", Event.KEY_DOWN, false],
  ["keyup", Event.KEY_UP, true],
  ["contextmenu", Event.RIGHT_CLICK, true],
  ["mousemove", Event.POINTER_MOVE, true],
  ["mousedown", Event.POINTER_DOWN, true],
  ["mouseup", Event.POINTER_UP, true],
  ["touchmove", Event.POINTER_MOVE, true],
  ["touchstart", Event.POINTER_DOWN, true],
  ["touchend", Event.POINTER_UP, true],
  ["wheel", Event.WHEEL, false],
  ["visibilitychange", Event.VISIBILITY_CHANGE, false],
];
