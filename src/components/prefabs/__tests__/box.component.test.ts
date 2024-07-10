import { ContainerMutable } from "../../../types";
import { expect } from "@jest/globals";
import { box } from "../box.component";
import { GraphicType } from "../../../enums";

describe("components", () => {
  describe("prefabs", () => {
    describe("box", () => {
      let $box: ContainerMutable;

      beforeAll(async () => {
        $box = await box({
          color: 0xff00ff,
          height: 200,
          width: 100,
          mass: 99,
          material: {},
        });
      });

      test("box container contains graphics with a polygon", () => {
        const child = $box.getChildren()[0];
        expect(child.$getRaw()).toStrictEqual({
          alpha: 1,
          angle: 0,
          color: 0xff00ff,
          eventMode: undefined,
          height: undefined,
          id: child.getId(),
          initialData: {},
          label: "empty",
          length: undefined,
          pivot: { x: 50, y: 100 },
          polygon: [0, 0, 100, 0, 100, 200, 0, 200],
          position: { x: 0, y: 0 },
          radius: undefined,
          type: GraphicType.POLYGON,
          visible: true,
          width: undefined,
          zIndex: 0,
        });
      });

      test("box contains a body", () => {
        expect($box.getBody()).not.toBe(null);
      });
    });
  });
});
