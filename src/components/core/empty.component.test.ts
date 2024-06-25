import { expect, test } from "@jest/globals";
import { empty } from "./empty.component";
import { body } from "./body.sub-component";

describe("components", () => {
  describe("core", () => {
    describe("empty", () => {
      const emptyPropsMutable = empty<any>({});

      //id
      test("getId() return the original id", () => {
        expect(emptyPropsMutable.getId()).toMatch(/empty_([0-9]{0,5})/);
      });

      //label
      test("getLabel() return label", () => {
        expect(emptyPropsMutable.getLabel()).toEqual("empty");
      });
      test("setLabel() changes label", () => {
        emptyPropsMutable.setLabel("not-empty");
        expect(emptyPropsMutable.getLabel()).toEqual("not-empty");
      });

      //position
      test("getPosition() return base position", () => {
        expect(emptyPropsMutable.getPosition()).toStrictEqual({
          x: 0,
          y: 0,
        });
      });
      test("setPosition(...) changes position", async () => {
        await emptyPropsMutable.setPosition({
          x: 123,
          y: 321,
        });
        expect(emptyPropsMutable.getPosition()).toStrictEqual({
          x: 123,
          y: 321,
        });
      });
      test("setPositionX(...) changes x position", async () => {
        await emptyPropsMutable.setPositionX((x) => x + 5);
        expect(emptyPropsMutable.getPosition()).toStrictEqual(
          expect.objectContaining({
            x: 123 + 5,
          }),
        );
      });
      test("setPositionY(...) changes y position", async () => {
        await emptyPropsMutable.setPositionY((y) => y + 9);
        expect(emptyPropsMutable.getPosition()).toStrictEqual(
          expect.objectContaining({
            y: 321 + 9,
          }),
        );
      });

      //angle
      test("getAngle(...) returns empty", async () => {
        expect(emptyPropsMutable.getAngle()).toEqual(0);
      });
      test("setAngle(...) changes the default value", async () => {
        await emptyPropsMutable.setAngle(23);
        expect(emptyPropsMutable.getAngle()).toEqual(23);
      });

      //data
      test("getData(...) returns empty", async () => {
        expect(emptyPropsMutable.getData()).toStrictEqual({});
      });
      test("setData(...) changes data", () => {
        emptyPropsMutable.setData({ abc: 123 });
        expect(emptyPropsMutable.getData()).toStrictEqual({
          abc: 123,
        });
        emptyPropsMutable.setData((data) => ({
          abc: data.abc + 100,
        }));
        expect(emptyPropsMutable.getData()).toStrictEqual({
          abc: 223,
        });
      });

      //getRaw
      test("$getRaw() to be contain everything", async () => {
        expect(emptyPropsMutable.$getRaw()).toStrictEqual(
          expect.objectContaining({
            angle: 23,
            initialData: { abc: 223 },
            label: "not-empty",
            position: { x: 128, y: 330 },
          }),
        );
      });

      //body
      test("setBody(...) to add a body with the current position and angle", async () => {
        expect(emptyPropsMutable.getBody()).toBe(undefined);

        const $body = body({});
        await emptyPropsMutable.setBody($body);
        expect(emptyPropsMutable.getBody()).toStrictEqual($body);
        expect($body.getPosition()).toStrictEqual({ x: 128, y: 330 });
        expect($body.getAngle()).toStrictEqual(23);
      });

      //sound
      //TODO mock howler
      test.todo("addSound(...) to add a sound and get the current position");
      test.todo("$destroy(...) to stop sounds");

      //componentName
      test("$getComponentName() to be null", async () => {
        expect(emptyPropsMutable.$getComponentName()).toStrictEqual(null);
      });

      //getFather
      test("getFather() to be null", async () => {
        expect(emptyPropsMutable.getFather).toStrictEqual(null);
      });

      //mutable
      test("$mutable to be false", async () => {
        expect(emptyPropsMutable.$mutable).toStrictEqual(false);
      });
    });
  });
});
