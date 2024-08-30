import { DisplayObjectEvent, Event } from "../enums";
import {
  DisplayObject,
  GlobalEventsType,
  PartialDisplayObjectMutable,
} from "../types";

export const events = (): GlobalEventsType => {
  let $eventMap: Record<Event, ((data?: any) => void)[]> = {
    [Event.TICK]: [],
    [Event.KEY_DOWN]: [],
    [Event.KEY_UP]: [],
    [Event.RESIZE]: [],
    [Event.LEFT_CLICK]: [],
    [Event.RIGHT_CLICK]: [],
    [Event.WHEEL]: [],
    [Event.POINTER_MOVE]: [],
    [Event.POINTER_DOWN]: [],
    [Event.POINTER_UP]: [],
    [Event.CURSOR_MOVE]: [],
    [Event.FPS]: [],
  };

  /**
   * Usage
   * ```
   * const removeTick = global.events.on(Event.TICK, () => {});
   * // Remove the event
   * removeTick()
   * ```
   * or with displayObject
   * ```
   * global.events.on(Event.TICK, () => {}, displayObject);
   * ```
   * @param event
   * @param callback
   * @param displayObjectComponent
   */
  const on = (
    event: Event,
    callback: (data?: any) => void | Promise<void>,
    displayObjectComponent?: PartialDisplayObjectMutable<DisplayObject>,
  ): (() => void) => {
    const callbackId = $eventMap[event].push(callback) - 1;
    displayObjectComponent?.on(DisplayObjectEvent.REMOVED, () => {
      $remove(event, callbackId);
    });
    return () => $remove(event, callbackId);
  };

  const $remove = (event: Event, callbackId: number) =>
    ($eventMap[event] = $eventMap[event].map((callback, $callbackId) =>
      callbackId === $callbackId ? undefined : callback,
    ));

  const $emit = (event: Event, data?: any) => {
    for (const callback of $eventMap[event].filter(Boolean)) callback(data);
  };

  return {
    on,

    $remove,
    $emit,
  };
};
