import { global } from "../global";
import { DisplayObjectEvent, Event, EventMode } from "../enums";
import { DisplayObjectMutable, GlobalContextType, Size } from "../types";
import { Graphics } from "pixi.js";

export const context = (): GlobalContextType => {
  const $contextualBackgroundGraphics = new Graphics();

  let $currentComponentContextId: string = null;
  let $contextDisplayObjectList: DisplayObjectMutable<any>[] = [];
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
      $getFocusComponent()?.$emit(DisplayObjectEvent.CONTEXT_LEAVE, {});
      $clear();
    });

    //resize background context
    global.events.on(Event.RESIZE, $resizeBelowContainer);
    $resizeBelowContainer(global.getApplication().window.getBounds());

    //check keyboard for the special chars
    global.events.on(Event.KEY_DOWN, (event: KeyboardEvent) => {
      const $focusComponent = $getFocusComponent();
      if (!$focusComponent) return;

      const stop = () => {
        event?.preventDefault?.();
        event?.stopPropagation();
      };

      const { key, shiftKey } = event;
      if (key === "ArrowDown") {
        $focusComponent.$emit(DisplayObjectEvent.CONTEXT_DOWN, {});
        stop();
      }
      if (key === "ArrowUp") {
        $focusComponent.$emit(DisplayObjectEvent.CONTEXT_UP, {});
        stop();
      }
      if (key === "Tab") {
        $focusComponent.$emit(
          shiftKey
            ? DisplayObjectEvent.CONTEXT_BACKWARD
            : DisplayObjectEvent.CONTEXT_FORWARD,
          {},
        );
        stop();
      }
    });
  };

  const $addComponent = (componentMutable: DisplayObjectMutable<any>) => {
    $contextDisplayObjectList.push(componentMutable);

    if (componentMutable.getId() === $currentComponentContextId)
      componentMutable.$emit(DisplayObjectEvent.CONTEXT_ENTER, {});
  };

  const $removeComponent = (componentMutable: DisplayObjectMutable<any>) => {
    $contextDisplayObjectList = $contextDisplayObjectList.filter(
      ($component) => $component.getId() !== componentMutable.getId(),
    );

    if (componentMutable.getId() === $currentComponentContextId) {
      componentMutable.$emit(DisplayObjectEvent.CONTEXT_LEAVE, {});
      $clear();
    }
  };

  const getFocus = (): string | null => $currentComponentContextId;
  const $getFocusComponent = (): DisplayObjectMutable<any> | null =>
    $contextDisplayObjectList.find(
      ($component) => $component.getId() === $currentComponentContextId,
    );

  const focus = (componentMutable: DisplayObjectMutable<any>) => {
    $getFocusComponent()?.$emit(DisplayObjectEvent.CONTEXT_LEAVE, {});
    $currentComponentContextId = componentMutable.getId();

    const targetFocusComponent = $getFocusComponent();
    if (!targetFocusComponent)
      console.warn(
        `Component with id (${componentMutable.getId()}) cannot be focused!`,
      );
    else targetFocusComponent?.$emit(DisplayObjectEvent.CONTEXT_ENTER, {});
  };

  const blur = () => {
    $getFocusComponent()?.$emit(DisplayObjectEvent.CONTEXT_LEAVE, {});
    $clear();
  };

  const $clear = () => {
    $currentComponentContextId = null;

    for (const onNoContextFunc of $onNoContextCallbackList) onNoContextFunc();
  };

  const onNoContext = (callback: () => void | Promise<void>): (() => void) => {
    const index = $onNoContextCallbackList.push(callback);

    return () =>
      ($onNoContextCallbackList = $onNoContextCallbackList.filter((func, i) =>
        i === index ? undefined : func,
      ));
  };

  return {
    $load,

    $addComponent,
    $removeComponent,

    focus,
    blur,
    getFocus,

    onNoContext,
  };
};
