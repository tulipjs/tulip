import { ContainerMutable } from "../../../types";
import { expect } from "@jest/globals";
import { circle } from "../circle.component";
import { Cursor, EventMode, GraphicType } from "../../../enums";

describe("components", () => {
  describe("prefabs", () => {
    describe("circle", () => {
      let $circle: ContainerMutable;

      beforeAll(async () => {
        $circle = await circle({
          color: 0xff00ff,
          mass: 99,
          size: 5,
          material: {},
        });
      });

      test("circle container contains graphics with a polygon", () => {
        const child = $circle.getChildren()[0];
        expect(child.$getRaw()).toStrictEqual({
          alpha: 1,
          angle: 0,
          color: 0xff00ff,
          eventMode: EventMode.PASSIVE,
          height: undefined,
          id: child.getId(),
          initialData: {},
          label: "empty",
          length: undefined,
          pivot: { x: 0, y: 0 },
          position: { x: 0, y: 0 },
          radius: 5,
          type: GraphicType.CIRCLE,
          visible: true,
          width: undefined,
          polygon: undefined,
          zIndex: 0,
          focused: true,
          hitArea: [],
          withContext: false,
          tint: 0xff00ff,
          sortableChildren: false,
          cursor: Cursor.AUTO,
        });
      });

      test("circle contains a body", () => {
        expect($circle.getBody()).not.toBe(null);
      });
    });
  });
});
