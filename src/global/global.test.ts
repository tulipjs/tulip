import { global } from "./global";
import * as PIXI from "pixi.js";
import { container } from "../components";
import { Event } from "../enums";

const mockEventsOn = jest.fn();

describe("global", () => {
  let $container;

  test("$setApplication(...) to return getApplication", () => {
    const application = new PIXI.Application();
    global.$setApplication(application);
    expect(global.getApplication()).toEqual(application);
  });
  test("$addComponent(...) to return $getComponentList", async () => {
    $container = await container();
    global.$addComponent($container);
    expect(global.$getComponentList()).toContain($container);
  });
  test("$removeComponent(...) to return $getComponentList", async () => {
    global.$removeComponent($container);
    expect(global.$getComponentList()).not.toContain($container);
  });
  test("setData(...) to return getData", async () => {
    global.setData((data) => ({ ...data, abc: 123 }));
    expect(global.getData()).toEqual({ abc: 123 });
    global.setData((data: any) => ({ ...data, abc: data.abc + 5 }));
    expect(global.getData()).toEqual({ abc: 123 + 5 });
  });
  test("$setVisualHitBoxes(...)", async () => {
    expect(global.$isVisualHitBoxes()).toEqual(false);
    global.$setVisualHitBoxes(true);
    expect(global.$isVisualHitBoxes()).toEqual(true);
  });
  describe("events", () => {
    let removeEventCallback;
    beforeAll(() => {
      removeEventCallback = global.events.on(Event.TICK, mockEventsOn);
    });
    beforeEach(() => {
      mockEventsOn.mockClear();
    });

    //TODO create new file with events only
    test("emit on events", async () => {
      global.events.$emit(Event.TICK, { data: 123 });
      expect(mockEventsOn).toHaveBeenCalledWith({ data: 123 });
    });

    test("remove event", async () => {
      removeEventCallback();
      global.events.$emit(Event.TICK, { data: 123 });
      expect(mockEventsOn).not.toHaveBeenCalled();
    });

    //TODO create context
  });
});
