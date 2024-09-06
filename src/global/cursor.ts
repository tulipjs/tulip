import { ApplicationMutable, GlobalCursorType, Point } from "../types";
import { Cursor, Event } from "../enums";
import { CursorLoadProps } from "../types";

export const cursor = (): GlobalCursorType => {
  let $getApplication: () => ApplicationMutable;
  let $normalizeValue: (value: number) => number;
  let $getScale: () => number;
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
    $getScale = window.getScale;

    events.on(Event.POINTER_MOVE, (event: MouseEvent | TouchEvent) => {
      let targetX = 0;
      let targetY = 0;

      if (event instanceof MouseEvent) {
        targetX = event.clientX;
        targetY = event.clientY;
      } else if (event instanceof TouchEvent) {
        const touch = event.touches[0];
        targetX = touch.clientX;
        targetY = touch.clientY;
      }

      const isXDifferent = position.x !== targetX;
      const isYDifferent = position.y !== targetY;

      if (isXDifferent) position.x = targetX;
      if (isYDifferent) position.y = targetY;

      if (isXDifferent || isYDifferent)
        events.$emit(Event.CURSOR_MOVE, getPosition());
    });
  };

  const getPosition = (): Point => {
    const scale = $getScale();
    return {
      x: $normalizeValue(position.x / scale),
      y: $normalizeValue(position.y / scale),
    };
  };

  const setCursor = (cursor: Cursor) => {
    $getApplication().$getApplication().canvas.style.cursor = cursor;
  };

  return {
    load,

    getPosition,
    setCursor,
  };
};
