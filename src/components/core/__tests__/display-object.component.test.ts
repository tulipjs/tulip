import * as PIXI from "pixi.js";
import { Container, DisplayObjectMutable } from "../../../types";
import { expect } from "@jest/globals";
import { Cursor, EventMode } from "../../../enums";
import { displayObject } from "../display-object.component";
import { global } from "../../../global";

const warnMock = jest.fn();
console.warn = warnMock;

describe("components", () => {
  describe("core", () => {
    describe("displayObject", () => {
      // const mockSetLabel = jest.fn();
      // const mockGetLabel = jest.fn();

      const container = new PIXI.Container();
      let displayObjectMutable: DisplayObjectMutable<Container>;

      beforeEach(() => {
        warnMock.mockClear();
      });

      beforeAll(async () => {
        displayObjectMutable = await displayObject({
          displayObject: container,
          label: "Old label",
          position: {
            x: 111,
            y: 333,
          },
          angle: 34,
          alpha: 0.4,
          zIndex: 99,
          visible: false,
          eventMode: EventMode.DYNAMIC,
          withContext: true,
          sortableChildren: true,
          scale: {
            x: 1,
            y: 1,
          },
          metadata: "draggable",
          tooltip: "tooltip",
        });
      });

      test("getDisplayObject() returns the current container", async () => {
        expect(container).toStrictEqual(
          displayObjectMutable.getDisplayObject(),
        );
        expect(warnMock).toBeCalledWith(
          'Prevent the use of "getDisplayObject()" in favor to add more functions to do specific tasks!',
        );
        warnMock.mockClear();
        displayObjectMutable.getDisplayObject({ __preventWarning: true });
        expect(warnMock).not.toBeCalled();
      });
      test("setLabel(...) of the display object", () => {
        expect(container.label).toBe("Old label");
        expect(displayObjectMutable.getLabel()).toEqual("Old label");

        displayObjectMutable.setLabel("Hello there!");
        expect(container.label).toBe("Hello there!");
        expect(displayObjectMutable.getLabel()).toEqual("Hello there!");
      });
      test("setPosition(...) of the display object", () => {
        expect(container.position.x).toBe(111);
        expect(container.position.y).toBe(333);
        expect(displayObjectMutable.getPosition()).toMatchObject({
          x: 111,
          y: 333,
        });

        displayObjectMutable.setPosition({ x: 23, y: 32 });
        expect(container.position.x).toBe(23);
        expect(container.position.y).toBe(32);
        expect(displayObjectMutable.getPosition()).toMatchObject({
          x: 23,
          y: 32,
        });
      });
      test("setPositionX(...) of the display object", () => {
        displayObjectMutable.setPositionX(323);
        expect(container.position.x).toBe(323);
        expect(displayObjectMutable.getPosition()).toStrictEqual(
          expect.objectContaining({
            x: 323,
          }),
        );
      });
      test("setPositionY(...) of the display object", () => {
        displayObjectMutable.setPositionY(747);
        expect(container.position.y).toBe(747);
        expect(displayObjectMutable.getPosition()).toStrictEqual(
          expect.objectContaining({
            y: 747,
          }),
        );
      });
      test("setPivot(...) of the display object", () => {
        displayObjectMutable.setPivot({ x: 23, y: 32 });
        expect(container.pivot.x).toBe(23);
        expect(container.pivot.y).toBe(32);
        expect(displayObjectMutable.getPivot()).toStrictEqual({ x: 23, y: 32 });
      });
      test("setPivotX(...) of the display object", () => {
        displayObjectMutable.setPivotX(555);
        expect(container.pivot.x).toBe(555);
        expect(displayObjectMutable.getPivot()).toStrictEqual(
          expect.objectContaining({
            x: 555,
          }),
        );
      });
      test("setPivotY(...) of the display object", () => {
        displayObjectMutable.setPivotY(363);
        expect(container.pivot.y).toBe(363);
        expect(displayObjectMutable.getPivot()).toStrictEqual(
          expect.objectContaining({
            y: 363,
          }),
        );
      });
      test("setVisible(...) of the display object", () => {
        expect(container.visible).toBe(false);
        expect(displayObjectMutable.getVisible()).toStrictEqual(false);

        displayObjectMutable.setVisible(true);
        expect(container.visible).toBe(true);
        expect(displayObjectMutable.getVisible()).toStrictEqual(true);
      });
      test("setZIndex(...) of the display object", () => {
        expect(container.zIndex).toBe(99);
        expect(displayObjectMutable.getZIndex()).toStrictEqual(99);

        displayObjectMutable.setZIndex(-95);
        expect(container.zIndex).toBe(-95);
        expect(displayObjectMutable.getZIndex()).toStrictEqual(-95);
      });
      test("setAlpha(...) of the display object", () => {
        expect(container.alpha).toBe(0.4);
        expect(displayObjectMutable.getAlpha()).toStrictEqual(0.4);

        displayObjectMutable.setAlpha(0.65);
        expect(container.alpha).toBe(0.65);
        expect(displayObjectMutable.getAlpha()).toStrictEqual(0.65);
      });
      test("setAngle(...) of the display object", () => {
        expect(container.angle).toBe(34);
        expect(displayObjectMutable.getAngle()).toStrictEqual(34);

        displayObjectMutable.setAngle(180);
        expect(container.angle).toBe(180);
        expect(displayObjectMutable.getAngle()).toStrictEqual(180);
      });
      test("setEventMode(...) of the display object", () => {
        expect(container.eventMode).toBe(EventMode.DYNAMIC);
        expect(displayObjectMutable.getEventMode()).toStrictEqual(
          EventMode.DYNAMIC,
        );

        displayObjectMutable.setEventMode(EventMode.NONE);
        expect(container.eventMode).toBe(EventMode.NONE);
        expect(displayObjectMutable.getEventMode()).toStrictEqual(
          EventMode.NONE,
        );
      });
      test("setTint(...) of the display object", () => {
        expect(container.tint).toBe(0xffffff);
        expect(displayObjectMutable.getTint()).toStrictEqual(0xffffff);

        displayObjectMutable.setTint(0xff00ff);
        expect(container.tint).toBe(0xff00ff);
        expect(displayObjectMutable.getTint()).toStrictEqual(0xff00ff);
      });
      test("getBounds() of the display object", () => {
        expect(container.getBounds()).toStrictEqual(
          expect.objectContaining({
            maxX: 0,
            maxY: 0,
            minX: 0,
            minY: 0,
          }),
        );
        expect(displayObjectMutable.getBounds()).toStrictEqual({
          height: 0,
          width: 0,
        });
      });
      test("setCursor(...) of the display object", () => {
        expect(container.cursor).toBe(Cursor.AUTO);
        expect(displayObjectMutable.getCursor()).toStrictEqual(Cursor.AUTO);

        displayObjectMutable.setCursor(Cursor.CROSSHAIR);
        expect(warnMock).toBeCalled();

        expect(container.cursor).toBe(Cursor.CROSSHAIR);
        expect(displayObjectMutable.getCursor()).toStrictEqual(
          Cursor.CROSSHAIR,
        );

        warnMock.mockClear();
        displayObjectMutable.setEventMode(EventMode.STATIC);
        displayObjectMutable.setCursor(Cursor.ALIAS);
        expect(displayObjectMutable.getCursor()).toStrictEqual(Cursor.ALIAS);
        expect(warnMock).not.toBeCalled();

        warnMock.mockClear();
        displayObjectMutable.setEventMode(EventMode.NONE);
        displayObjectMutable.setCursor(Cursor.COL_RESIZE, true);
        expect(displayObjectMutable.getCursor()).toStrictEqual(
          Cursor.COL_RESIZE,
        );
        expect(warnMock).not.toBeCalled();
      });
      test("setHitArea(...) of the display object", () => {
        expect(displayObjectMutable.getHitArea()).toStrictEqual([]);
        expect(container.hitArea).toStrictEqual(undefined);

        displayObjectMutable.setHitArea([0, 10, 10, 10, 10, 0, 0, 0]);
        expect(displayObjectMutable.getHitArea()).toStrictEqual([
          0, 10, 10, 10, 10, 0, 0, 0,
        ]);
        expect(container.hitArea).toStrictEqual(
          new PIXI.Polygon([0, 10, 10, 10, 10, 0, 0, 0]),
        );
      });
      test("blur() to be called", () => {
        expect(displayObjectMutable.getWithContext()).toStrictEqual(true);
        displayObjectMutable.blur();
        expect(displayObjectMutable.isFocused()).toStrictEqual(false);
        expect(global.context.getFocus()).not.toStrictEqual(
          displayObjectMutable.getId(),
        );
      });
      test("focus() to be called", () => {
        expect(displayObjectMutable.getWithContext()).toStrictEqual(true);
        displayObjectMutable.focus();
        expect(displayObjectMutable.isFocused()).toStrictEqual(true);
        expect(global.context.getFocus()).toStrictEqual(
          displayObjectMutable.getId(),
        );
      });
      test("check focus to be called", () => {
        expect(displayObjectMutable.getWithContext()).toStrictEqual(true);
        expect(displayObjectMutable.isFocused()).toStrictEqual(true);
        expect(global.context.getFocus()).toStrictEqual(
          displayObjectMutable.getId(),
        );
      });
      test("setSortableChildren() to be called", () => {
        expect(
          displayObjectMutable.getDisplayObject({ __preventWarning: true })
            .sortableChildren,
        ).toStrictEqual(true);
        expect(displayObjectMutable.isSortableChildren()).toStrictEqual(true);

        displayObjectMutable.setSortableChildren(false);
        expect(displayObjectMutable.isSortableChildren()).toStrictEqual(false);
        expect(
          displayObjectMutable.getDisplayObject({ __preventWarning: true })
            .sortableChildren,
        ).toStrictEqual(false);
      });
      test("setScale(...) of the display object", () => {
        displayObjectMutable.setScale({ x: 1, y: -1 });
        expect(container.scale.x).toBe(1);
        expect(container.scale.y).toBe(-1);
        expect(displayObjectMutable.getScale()).toStrictEqual({ x: 1, y: -1 });
      });
      test("setScaleX(...) of the display object", () => {
        displayObjectMutable.setScaleX(-1);
        expect(container.scale.x).toBe(-1);
        expect(displayObjectMutable.getScale()).toStrictEqual(
          expect.objectContaining({
            x: -1,
          }),
        );
      });
      test("setScaleY(...) of the display object", () => {
        displayObjectMutable.setScaleY(2);
        expect(container.scale.y).toBe(2);
        expect(displayObjectMutable.getScale()).toStrictEqual(
          expect.objectContaining({
            y: 2,
          }),
        );
      });
      test("setTooltip(...) of the display object", () => {
        expect(displayObjectMutable.getTooltip()).toStrictEqual("tooltip");
        displayObjectMutable.setTooltip("test");
        expect(displayObjectMutable.getTooltip()).toStrictEqual("test");
      });
      test("getMetadata(...)", () => {
        expect(displayObjectMutable.getMetadata()).toEqual("draggable");
      });
      test("$getRaw() to contain all the elements", () => {
        expect(displayObjectMutable.$getRaw()).toStrictEqual({
          id: displayObjectMutable.getId(),
          alpha: 0.65,
          angle: 180,
          initialData: {},
          label: "Hello there!",
          pivot: { x: 555, y: 363 },
          position: { x: 323, y: 747 },
          visible: true,
          zIndex: -95,
          eventMode: EventMode.NONE,
          hitArea: [0, 10, 10, 10, 10, 0, 0, 0],
          withContext: true,
          sortableChildren: false,
          tint: 0xff00ff,
          cursor: Cursor.COL_RESIZE,
          scale: {
            x: -1,
            y: 2,
          },
          metadata: "draggable",
          tooltip: "test",
        });
      });

      //TODO Mock events
      test.todo("on(...)");
    });
  });
});
