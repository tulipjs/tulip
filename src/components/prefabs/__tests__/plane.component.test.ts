import { ContainerMutable } from "../../../types";
import { expect } from "@jest/globals";
import { plane } from "../plane.component";
import { Cursor, EventMode, GraphicType } from "../../../enums";

describe("components", () => {
  describe("prefabs", () => {
    describe("plane", () => {
      let $plane: ContainerMutable;

      beforeAll(async () => {
        $plane = await plane({
          tint: 0xff00ff,
        });
      });

      test("circle container contains graphics with a polygon", () => {
        const child = $plane.getChildren()[0];
        expect(child.$getRaw()).toStrictEqual({
          alpha: 1,
          angle: 0,
          eventMode: EventMode.PASSIVE,
          height: undefined,
          id: child.getId(),
          initialData: {},
          label: "empty",
          length: undefined,
          pivot: { x: 5000, y: 2.5 },
          position: { x: 0, y: 0 },
          radius: undefined,
          type: GraphicType.POLYGON,
          visible: true,
          width: undefined,
          polygon: [0, 0, 10000, 0, 10000, 5, 0, 5],
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
        expect($plane.getBody()).not.toBe(null);
      });
    });
  });
});
