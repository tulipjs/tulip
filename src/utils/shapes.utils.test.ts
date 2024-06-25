import { getShape, getVisualShape } from "./shapes.utils";
import { GraphicType, Shape } from "../enums";

describe("utils", () => {
  describe("shapes", () => {
    describe("getShape", () => {
      test("check that shape is p2.circle", () => {
        const shape = getShape({ type: Shape.CIRCLE, radius: 3 });
        expect(shape.type).toEqual(1);
      });
      test("check that shape is p2.plane", () => {
        const shape = getShape({ type: Shape.PLANE });
        expect(shape.type).toEqual(4);
      });
      test("check that shape is p2.box", () => {
        const shape = getShape({ type: Shape.BOX, height: 10, width: 10 });
        expect(shape.type).toEqual(8);
      });
      test("check that shape is p2.capsule", () => {
        const shape = getShape({ type: Shape.CAPSULE, length: 20, radius: 15 });
        expect(shape.type).toEqual(64);
      });
      test("check that shape is p2.convex", () => {
        const shape = getShape({
          type: Shape.CONVEX,
          width: 13,
          height: 45,
          vertices: [],
        });
        expect(shape.type).toEqual(8);
      });
    });
    describe("getVisualShape", () => {
      test("check that shape is graphics.circle", async () => {
        const shape = await getVisualShape({ type: Shape.CIRCLE, radius: 3 });
        expect(shape.getType()).toEqual(GraphicType.CIRCLE);
      });
      test("check that shape is graphics.plane", async () => {
        const shape = await getVisualShape({ type: Shape.PLANE });
        expect(shape.getType()).toEqual(GraphicType.POLYGON);
      });
      test("check that shape is graphics.box", async () => {
        const shape = await getVisualShape({
          type: Shape.BOX,
          height: 10,
          width: 10,
        });
        expect(shape.getType()).toEqual(GraphicType.POLYGON);
      });
      test("check that shape is graphics.capsule", async () => {
        const shape = await getVisualShape({
          type: Shape.CAPSULE,
          length: 20,
          radius: 15,
        });
        expect(shape.getType()).toEqual(GraphicType.CAPSULE);
      });
      test("check that shape is graphics.convex", async () => {
        const shape = await getVisualShape({
          type: Shape.CONVEX,
          width: 13,
          height: 45,
          vertices: [],
        });
        expect(shape.getType()).toEqual(GraphicType.TRIANGLE);
      });
    });
  });
});
