import { ApplicationMutable, GlobalCursorType, Point } from "../types";
import { Cursor, Event } from "../enums";
import { CursorLoadProps } from "../types";

export const cursor = (): GlobalCursorType => {
  let $getApplication: () => ApplicationMutable;
  let position: Point = {
    x: 0,
    y: 0,
  };

  const load = ({ getApplication, events, window }: CursorLoadProps) => {
    $getApplication = getApplication;

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

  const setCursor = (cursor: Cursor) => {
    $getApplication().$getApplication().canvas.style.cursor = cursor;
  };

  return {
    load,

    getPosition,
    setCursor,
  };
};
