import { setCanvasTooltip } from "../utils";
import {
  ApplicationMutable,
  DisplayObject,
  DisplayObjectMutable,
  GlobalTooltipType,
  Point,
  TooltipLoadProps,
} from "../types";
import { Event } from "../enums";

export const tooltip = (): GlobalTooltipType => {
  let $cursorPosition: Point = { x: 0, y: 0 };

  let $getApplication: () => ApplicationMutable;

  let $getComponent: (tooltip: string) => DisplayObjectMutable<DisplayObject>;
  let currentComponent: DisplayObjectMutable<DisplayObject>;

  const load = ({ events, getApplication }: TooltipLoadProps) => {
    $getApplication = getApplication;

    events.on(Event.CURSOR_MOVE, (cursorPosition) => {
      $cursorPosition = cursorPosition;
      currentComponent?.setPosition($cursorPosition);
    });
  };

  const setComponent = (
    onLoadComponent?: (tooltip: string) => DisplayObjectMutable<DisplayObject>,
  ) => {
    $getComponent = onLoadComponent;
  };

  const setTooltip = (tooltip?: string) => {
    if (!$getComponent) return setCanvasTooltip(tooltip);

    if (currentComponent) $getApplication().remove(currentComponent);
    currentComponent = tooltip ? $getComponent(tooltip) : null;
    if (currentComponent) {
      $getApplication().add(currentComponent);
      currentComponent.setPosition($cursorPosition);
      currentComponent.setZIndex(Number.MAX_SAFE_INTEGER);
    }
  };

  return {
    load,
    setComponent,
    setTooltip,
  };
};
