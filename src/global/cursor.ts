import { ApplicationMutable, GlobalCursorType, Point } from "../types";
import { Cursor, Event } from "../enums";
import { CursorLoadProps } from "../types";

export const cursor = (): GlobalCursorType => {
  let $getApplication: () => ApplicationMutable;
  let $normalizeValue: (value: number) => number;
  let position: Point = {
    x: 0,
    y: 0,
  };

  const load = ({
    normalizeValue,
    getApplication,
    events,
    window,
  }: CursorLoadProps) => {
    $normalizeValue = normalizeValue;
    $getApplication = getApplication;

    events.on(Event.POINTER_MOVE, (event: MouseEvent | TouchEvent) => {
      const scale = window.getScale();

      let targetX = 0;
      let targetY = 0;

      if (event instanceof MouseEvent) {
        targetX = $normalizeValue(event.clientX / scale);
        targetY = $normalizeValue(event.clientY / scale);
      } else if (event instanceof TouchEvent) {
        const touch = event.touches[0];
        targetX = $normalizeValue(touch.clientX / scale);
        targetY = $normalizeValue(touch.clientY / scale);
      }

      const isXDifferent = position.x !== targetX;
      const isYDifferent = position.y !== targetY;

      if (isXDifferent) position.x = targetX;
      if (isYDifferent) position.y = targetY;

      if (isXDifferent || isYDifferent)
        events.$emit(Event.CURSOR_MOVE, { ...position });
    });
  };

  const getPosition = (): Point => ({
    ...position,
  });

  const setCursor = (cursor: Cursor) => {
    $getApplication().$getApplication().canvas.style.cursor = cursor;
  };

  return {
    load,

    getPosition,
    setCursor,
  };
};
