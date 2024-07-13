import { ContainerMutable } from "../../../types";
import { expect } from "@jest/globals";
import { plane } from "../plane.component";
import { EventMode, GraphicType } from "../../../enums";

describe("components", () => {
  describe("prefabs", () => {
    describe("plane", () => {
      let $plane: ContainerMutable;

      beforeAll(async () => {
        $plane = await plane({
          props: {
            color: 0xff00ff,
          },
        });
      });

      test("circle container contains graphics with a polygon", () => {
        const child = $plane.getChildren()[0];
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
        });
      });

      test("circle contains a body", () => {
        expect($plane.getBody()).not.toBe(null);
      });
    });
  });
});
