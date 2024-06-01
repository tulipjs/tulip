import { EventMode } from "../enums";
import { DisplayObjectProps } from "../types";

export const DISPLAY_OBJECT_DEFAULT_PROPS: DisplayObjectProps = {
  position: { x: 0, y: 0 },
  pivot: { x: 0, y: 0 },
  eventMode: EventMode.PASSIVE,
  visible: true,
  alpha: 1,
};
