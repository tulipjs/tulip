import { Event } from "../enums";

export const events = () => {
  let $eventMap: Record<Event, any[]> = {
    [Event.TICK]: [],
  };

  const on = (
    event: Event,
    callback: (data?: any) => void | Promise<void>,
  ): number => $eventMap[event].push(callback) - 1;

  const remove = (event: Event, callbackId: number) =>
    ($eventMap[event] = $eventMap[event].map((callback, $callbackId) =>
      callbackId === $callbackId ? undefined : callback,
    ));

  const $emit = (event: Event, data?: any) => {
    for (const callback of $eventMap[event].filter(Boolean)) callback(data);
  };

  return {
    on,
    remove,

    $emit,
  };
};
