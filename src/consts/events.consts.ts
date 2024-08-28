import { Event } from "../enums";

export const EVENT_MAP: [string, Event][] = [
  ["keydown", Event.KEY_DOWN],
  ["keyup", Event.KEY_UP],
  ["contextmenu", Event.RIGHT_CLICK],
  ["mousemove", Event.MOUSE_MOVE],
  ["mousedown", Event.MOUSE_DOWN],
  ["mouseup", Event.MOUSE_UP],
];
