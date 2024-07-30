import { ContainerMutable } from "../../../types";
import { expect } from "@jest/globals";
import { capsule } from "../capsule.component";
import { Cursor, EventMode, GraphicType } from "../../../enums";

describe("components", () => {
  describe("prefabs", () => {
    describe("capsule", () => {
      let $capsule: ContainerMutable;

      beforeAll(() => {
        $capsule = capsule({
          tint: 0xff00ff,
          mass: 99,
          length: 54,
          radius: 23,
          material: {},
        });
      });

      test("capsule container contains graphics with a polygon", () => {
        const child = $capsule.getChildren()[0];
        expect(child.$getRaw()).toStrictEqual({
          alpha: 1,
          angle: 0,
          eventMode: EventMode.PASSIVE,
          height: undefined,
          id: child.getId(),
          initialData: {},
          label: "empty",
          length: 54,
          pivot: { x: 0, y: 0 },
          position: { x: 0, y: 0 },
          radius: 23,
          type: GraphicType.CAPSULE,
          visible: true,
          width: undefined,
          polygon: undefined,
          zIndex: 0,
          hitArea: [],
          withContext: false,
          focused: true,
          tint: 0xff00ff,
          sortableChildren: false,
          cursor: Cursor.AUTO,
        });
      });

      test("box contains a body", () => {
        expect($capsule.getBody()).not.toBe(null);
      });
    });
  });
});
