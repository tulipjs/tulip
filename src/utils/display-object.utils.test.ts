import * as PIXI from "pixi.js";
import { getDisplayObjectMutable } from "./display-object.utils";
import { empty } from "../components";

describe("utils", () => {
  describe("getDisplayObjectMutable", () => {
    // const mockSetLabel = jest.fn();
    // const mockGetLabel = jest.fn();

    const emptyMutable = empty({
      label: "Old label",
      position: {
        x: 0,
        y: 0,
      },
    });

    const container = new PIXI.Container();
    const displayObjectMutable = getDisplayObjectMutable(
      container,
      emptyMutable,
    );
    test("getDisplayObject() returns the current container", async () => {
      expect(container).toStrictEqual(displayObjectMutable.getDisplayObject());
    });
    test("setLabel(...) of the display object", async () => {
      expect(container.label).toBe("Old label");
      expect(emptyMutable.getLabel()).toEqual("Old label");

      displayObjectMutable.setLabel("Hello there!");
      expect(container.label).toBe("Hello there!");
      expect(emptyMutable.getLabel()).toEqual("Hello there!");
    });
    test("setPosition(...) of the display object", async () => {
      displayObjectMutable.setLabel("Hello there!");
      expect(container.label).toBe("Hello there!");
      expect(emptyMutable.getLabel()).toEqual("Hello there!");
    });
  });
});
