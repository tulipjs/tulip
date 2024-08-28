import { GlobalEventsType, Point } from "../types";
import { Event } from "../enums";

export const cursor = () => {
  let position: Point = {
    x: 0,
    y: 0,
  };

  const load = (events: GlobalEventsType, window) => {
    events.on(Event.MOUSE_MOVE, (event: MouseEvent) => {
      const scale = window.getScale();
      const isPixelPerfect = window.isPixelPerfect();

      const round = (value: number) =>
        isPixelPerfect ? Math.round(value) : value;

      const targetX = round(event.clientX / scale);
      const targetY = round(event.clientY / scale);

      const isXDifferent = position.x !== targetX;
      const isYDifferent = position.y !== targetY;

      if (isXDifferent) position.x = targetX;
      if (isYDifferent) position.y = targetY;

      if (isXDifferent || isYDifferent)
        events.$emit(Event.CURSOR_MOVE, { position: { ...position } });
    });
  };

  const getPosition = (): Point => ({
    ...position,
  });

  return {
    load,

    getPosition,
  };
};
