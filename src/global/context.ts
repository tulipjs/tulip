import { global } from "../global";
import { DisplayObjectEvent, Event, EventMode } from "../enums";
import { DisplayObjectMutable, Size } from "../types";
import { Graphics } from "pixi.js";

export const context = () => {
  const $contextualBackgroundGraphics = new Graphics();

  let $currentContext: DisplayObjectMutable<any>[] = [];
  let $onNoContextCallbackList: Function[] = [];

  const $resizeBelowContainer = ({ width, height }: Size) => {
    $contextualBackgroundGraphics
      .clear()
      .poly([0, 0, 0, height, width, height, width, 0])
      .fill({ alpha: 0 });
  };

  const $load = () => {
    $contextualBackgroundGraphics.eventMode = EventMode.STATIC;
    $contextualBackgroundGraphics.zIndex = Number.MIN_SAFE_INTEGER;
    global
      .getApplication()
      .$getApplication()
      .stage.addChild($contextualBackgroundGraphics);

    $contextualBackgroundGraphics.on(DisplayObjectEvent.POINTER_UP, () => {
      for (const $currentContextElement of $currentContext)
        $currentContextElement.$emit(DisplayObjectEvent.CONTEXT_LEAVE, {});
      clear();
    });

    global.events.on(Event.RESIZE, $resizeBelowContainer);
    $resizeBelowContainer(global.getApplication().window.getBounds());
  };

  const $getCurrentContextIdList = () =>
    $currentContext.map((component) => component.getId());

  const $getFilteredComponentMutable = (
    ...componentMutable: DisplayObjectMutable<any>[]
  ) => componentMutable.filter(($component) => $component.getWithContext());

  const add = (...componentMutable: DisplayObjectMutable<any>[]) => {
    const $targetComponentMutable = $getFilteredComponentMutable(
      ...componentMutable,
    );

    $currentContext.push(...$targetComponentMutable);

    for (const $currentContextElement of $targetComponentMutable)
      $currentContextElement.$emit(DisplayObjectEvent.CONTEXT_ENTER, {});
  };

  const set = (...componentMutable: DisplayObjectMutable<any>[]) => {
    const $targetComponentMutable = $getFilteredComponentMutable(
      ...componentMutable,
    );

    const currentContextIdList = $getCurrentContextIdList();

    if (
      $targetComponentMutable.length === currentContextIdList.length &&
      $targetComponentMutable.every(($component) =>
        currentContextIdList.includes($component.getId()),
      )
    )
      return;
    for (const $currentContextElement of $currentContext)
      $currentContextElement.$emit(DisplayObjectEvent.CONTEXT_LEAVE, {});

    $currentContext = $targetComponentMutable;

    for (const $currentContextElement of $currentContext)
      $currentContextElement.$emit(DisplayObjectEvent.CONTEXT_ENTER, {});
  };
  const remove = (...componentMutable: DisplayObjectMutable<any>[]) => {
    const $targetComponentMutable = $getFilteredComponentMutable(
      ...componentMutable,
    );

    const componentList = $targetComponentMutable.map(($component) =>
      $component.getId(),
    );
    const foundContext = $currentContext.filter(($component) =>
      componentList.includes($component.getId()),
    );

    for (const $currentContextElement of foundContext)
      $currentContextElement.$emit(DisplayObjectEvent.CONTEXT_LEAVE, {});

    $currentContext = $currentContext.filter(
      ($component) => !componentList.includes($component.getId()),
    );

    if (!$currentContext.length) clear();
  };

  const get = () => $currentContext;
  const has = (...componentMutable: DisplayObjectMutable<any>[]) => {
    if (componentMutable.every(($component) => !$component.getWithContext()))
      return true;
    const currentContextIdList = $getCurrentContextIdList();
    return componentMutable.every(($component) =>
      currentContextIdList.includes($component.getId()),
    );
  };

  const clear = () => {
    for (const $currentContextElement of $currentContext)
      $currentContextElement.$emit(DisplayObjectEvent.CONTEXT_LEAVE, {});

    $currentContext = [];
    for (const onNoContextFunc of $onNoContextCallbackList) onNoContextFunc();
  };

  const onNoContext = (callback: () => void | Promise<void>) => {
    const index = $onNoContextCallbackList.push(callback);

    return () =>
      ($onNoContextCallbackList = $onNoContextCallbackList.filter((func, i) =>
        i === index ? undefined : func,
      ));
  };

  return {
    $load,

    add,
    set,
    remove,
    get,
    has,
    clear,

    onNoContext,
  };
};
