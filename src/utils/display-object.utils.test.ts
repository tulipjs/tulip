import * as PIXI from "pixi.js";
import { initDisplayObjectMutable } from "./display-object.utils";
import { empty } from "../components";
import { Container, DisplayObjectMutable } from "../types";
import { expect } from "@jest/globals";
import { EventMode } from "../enums";

describe("utils", () => {
  describe("initDisplayObjectMutable", () => {
    // const mockSetLabel = jest.fn();
    // const mockGetLabel = jest.fn();

    const emptyMutable = empty({
      label: "Old label",
      position: {
        x: 111,
        y: 333,
      },
      angle: 34,
      alpha: 0.4,
      zIndex: 99,
      eventMode: EventMode.DYNAMIC,
    });

    const container = new PIXI.Container();
    let displayObjectMutable: DisplayObjectMutable<Container>;

    test("getDisplayObject() returns the current container", async () => {
      displayObjectMutable = await initDisplayObjectMutable(
        container,
        emptyMutable,
      );

      expect(container).toStrictEqual(displayObjectMutable.getDisplayObject());
    });
    test("setLabel(...) of the display object", async () => {
      expect(container.label).toBe("Old label");
      expect(displayObjectMutable.getLabel()).toEqual("Old label");

      displayObjectMutable.setLabel("Hello there!");
      expect(container.label).toBe("Hello there!");
      expect(displayObjectMutable.getLabel()).toEqual("Hello there!");
    });
    test("setPosition(...) of the display object", async () => {
      expect(container.position.x).toBe(111);
      expect(container.position.y).toBe(333);
      expect(displayObjectMutable.getPosition()).toMatchObject({
        x: 111,
        y: 333,
      });

      await displayObjectMutable.setPosition({ x: 23, y: 32 });
      expect(container.position.x).toBe(23);
      expect(container.position.y).toBe(32);
      expect(displayObjectMutable.getPosition()).toMatchObject({
        x: 23,
        y: 32,
      });
    });
    test("setPositionX(...) of the display object", async () => {
      await displayObjectMutable.setPositionX(323);
      expect(container.position.x).toBe(323);
      expect(displayObjectMutable.getPosition()).toStrictEqual(
        expect.objectContaining({
          x: 323,
        }),
      );
    });
    test("setPositionY(...) of the display object", async () => {
      await displayObjectMutable.setPositionY(747);
      expect(container.position.y).toBe(747);
      expect(displayObjectMutable.getPosition()).toStrictEqual(
        expect.objectContaining({
          y: 747,
        }),
      );
    });
    test("setPivot(...) of the display object", async () => {
      await displayObjectMutable.setPivot({ x: 23, y: 32 });
      expect(container.pivot.x).toBe(23);
      expect(container.pivot.y).toBe(32);
      expect(displayObjectMutable.getPivot()).toStrictEqual({ x: 23, y: 32 });
    });
    test("setPivotX(...) of the display object", async () => {
      await displayObjectMutable.setPivotX(555);
      expect(container.pivot.x).toBe(555);
      expect(displayObjectMutable.getPivot()).toStrictEqual(
        expect.objectContaining({
          x: 555,
        }),
      );
    });
    test("setPivotY(...) of the display object", async () => {
      await displayObjectMutable.setPivotY(363);
      expect(container.pivot.y).toBe(363);
      expect(displayObjectMutable.getPivot()).toStrictEqual(
        expect.objectContaining({
          y: 363,
        }),
      );
    });
    test("setVisible(...) of the display object", async () => {
      expect(container.visible).toBe(true);
      expect(displayObjectMutable.getVisible()).toStrictEqual(true);

      await displayObjectMutable.setVisible(false);
      expect(container.visible).toBe(false);
      expect(displayObjectMutable.getVisible()).toStrictEqual(false);
    });
    test("setZIndex(...) of the display object", async () => {
      expect(container.zIndex).toBe(0);
      expect(displayObjectMutable.getZIndex()).toStrictEqual(0);

      await displayObjectMutable.setZIndex(-95);
      expect(container.zIndex).toBe(-95);
      expect(displayObjectMutable.getZIndex()).toStrictEqual(-95);
    });
    test("setAlpha(...) of the display object", async () => {
      expect(container.alpha).toBe(0.4);
      expect(displayObjectMutable.getAlpha()).toStrictEqual(0.4);

      await displayObjectMutable.setAlpha(0.65);
      expect(container.alpha).toBe(0.65);
      expect(displayObjectMutable.getAlpha()).toStrictEqual(0.65);
    });
    test("setAngle(...) of the display object", async () => {
      expect(container.angle).toBe(34);
      expect(displayObjectMutable.getAngle()).toStrictEqual(34);

      await displayObjectMutable.setAngle(180);
      expect(container.angle).toBe(180);
      expect(displayObjectMutable.getAngle()).toStrictEqual(180);
    });
    test("setEventMode(...) of the display object", async () => {
      expect(container.eventMode).toBe(EventMode.DYNAMIC);
      expect(displayObjectMutable.getEventMode()).toStrictEqual(
        EventMode.DYNAMIC,
      );

      await displayObjectMutable.setEventMode(EventMode.PASSIVE);
      expect(container.eventMode).toBe(EventMode.PASSIVE);
      expect(displayObjectMutable.getEventMode()).toStrictEqual(
        EventMode.PASSIVE,
      );
    });
    test("$getRaw() to contain all the elements", async () => {
      expect(displayObjectMutable.$getRaw()).toStrictEqual({
        id: displayObjectMutable.getId(),
        alpha: 0.65,
        angle: 180,
        initialData: {},
        label: "Hello there!",
        pivot: { x: 555, y: 363 },
        position: { x: 323, y: 747 },
        visible: false,
        zIndex: -95,
        eventMode: EventMode.PASSIVE,
      });
    });

    //TODO Mock events
    test.todo("on(...)");
  });
});
