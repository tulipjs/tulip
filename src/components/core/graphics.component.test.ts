import { expect, test } from "@jest/globals";
import { ContainerMutable, GraphicsMutable } from "../../types";
import { graphics } from "./graphics.component";
import { GraphicType } from "../../enums";
import { container } from "./container.component";

describe("components", () => {
  describe("core", () => {
    describe("graphics", () => {
      let $container: ContainerMutable;

      let $polygon: GraphicsMutable;
      let $circle: GraphicsMutable;
      let $capsule: GraphicsMutable;
      let $triangle: GraphicsMutable;

      beforeAll(async () => {
        $container = await container();
        $polygon = await graphics({
          label: "polygon",
          color: 0xff00ff,
          type: GraphicType.POLYGON,
          polygon: [0, 0, 10, 0, 10, 10, 10, 0],
        });
        $circle = await graphics({
          label: "circle",
          color: 0xff00ff,
          type: GraphicType.CIRCLE,
          radius: 3,
        });
        $capsule = await graphics({
          label: "capsule",
          color: 0xff00ff,
          type: GraphicType.CAPSULE,
          radius: 5,
          length: 12,
        });
        $triangle = await graphics({
          label: "triangle",
          color: 0xff00ff,
          type: GraphicType.TRIANGLE,
          width: 23,
          height: 45,
        });
        $container.add($polygon, $circle, $capsule, $triangle);
      });
      describe("polygon", () => {
        test("getType() check if is a polygon", async () => {
          expect($polygon.getType()).toBe(GraphicType.POLYGON);
          expect($polygon.getPolygon()).toEqual([0, 0, 10, 0, 10, 10, 10, 0]);

          expect($polygon.getLength()).toEqual(undefined);
          expect($polygon.getRadius()).toEqual(undefined);
          expect($polygon.getWidth()).toEqual(undefined);
          expect($polygon.getHeight()).toEqual(undefined);
        });

        test("getId() return the original id to check that empty is being called", async () => {
          expect($polygon.getId()).toMatch(/polygon_([0-9]{0,5})/);
        });
      });
      describe("circle", () => {
        test("getType() check if is a circle", async () => {
          expect($circle.getType()).toBe(GraphicType.CIRCLE);
          expect($circle.getRadius()).toBe(3);

          expect($circle.getPolygon()).toEqual(undefined);
          expect($circle.getLength()).toEqual(undefined);
          expect($circle.getWidth()).toEqual(undefined);
          expect($circle.getHeight()).toEqual(undefined);
        });

        test("getId() return the original id to check that empty is being called", async () => {
          expect($circle.getId()).toMatch(/circle_([0-9]{0,5})/);
        });
      });
      describe("capsule", () => {
        test("getType() check if is a capsule", async () => {
          expect($capsule.getType()).toBe(GraphicType.CAPSULE);
          expect($capsule.getRadius()).toBe(5);
          expect($capsule.getLength()).toBe(12);

          expect($capsule.getPolygon()).toEqual(undefined);
          expect($capsule.getWidth()).toEqual(undefined);
          expect($capsule.getHeight()).toEqual(undefined);
        });

        test("getId() return the original id to check that empty is being called", async () => {
          expect($capsule.getId()).toMatch(/capsule_([0-9]{0,5})/);
        });
      });
      describe("triangle", () => {
        test("getType() check if is a triangle", async () => {
          expect($triangle.getType()).toBe(GraphicType.TRIANGLE);
          expect($triangle.getWidth()).toBe(23);
          expect($triangle.getHeight()).toBe(45);

          expect($triangle.getPolygon()).toEqual(undefined);
          expect($triangle.getLength()).toEqual(undefined);
          expect($triangle.getRadius()).toEqual(undefined);
        });

        test("getId() return the original id to check that empty is being called", async () => {
          expect($triangle.getId()).toMatch(/triangle_([0-9]{0,5})/);
        });
      });

      test("getLabel() return the label to check that initDisplayObject is being called", async () => {
        $polygon.setLabel("This is being called!");
        expect($polygon.getLabel()).toBe("This is being called!");
      });
      test("setColor(...) check if 'tint' is set", async () => {
        expect($polygon.getColor()).toStrictEqual(0xff00ff);
        expect($polygon.getDisplayObject().tint).toStrictEqual(0xff00ff);

        $polygon.setColor(0xff0000);
        expect($polygon.getColor()).toStrictEqual(0xff0000);
        expect($polygon.getDisplayObject().tint).toStrictEqual(0xff0000);
      });
      test("setPolygon(...) change graphics type", () => {
        $circle.setPolygon([0, 20, 0, 230]);

        expect($circle.getType()).toBe(GraphicType.POLYGON);
        expect($circle.getPolygon()).toEqual([0, 20, 0, 230]);

        expect($circle.getLength()).toEqual(undefined);
        expect($circle.getRadius()).toEqual(undefined);
        expect($circle.getWidth()).toEqual(undefined);
        expect($circle.getHeight()).toEqual(undefined);
      });
      test("setCircle(...) change graphics type", () => {
        $polygon.setCircle(123);

        expect($polygon.getType()).toBe(GraphicType.CIRCLE);
        expect($polygon.getRadius()).toBe(123);

        expect($polygon.getPolygon()).toEqual(undefined);
        expect($polygon.getLength()).toEqual(undefined);
        expect($polygon.getWidth()).toEqual(undefined);
        expect($polygon.getHeight()).toEqual(undefined);
      });
      test("setCapsule(...) change graphics type", () => {
        $polygon.setCapsule(18, 98);

        expect($polygon.getType()).toBe(GraphicType.CAPSULE);
        expect($polygon.getRadius()).toBe(98);
        expect($polygon.getLength()).toBe(18);

        expect($polygon.getPolygon()).toEqual(undefined);
        expect($polygon.getWidth()).toEqual(undefined);
        expect($polygon.getHeight()).toEqual(undefined);
      });
      test("setTriangle(...) change graphics type", () => {
        $polygon.setTriangle(45, 32);

        expect($polygon.getType()).toBe(GraphicType.TRIANGLE);
        expect($polygon.getWidth()).toBe(45);
        expect($polygon.getHeight()).toBe(32);

        expect($polygon.getPolygon()).toEqual(undefined);
        expect($polygon.getLength()).toEqual(undefined);
        expect($polygon.getRadius()).toEqual(undefined);
      });
      test("$getRaw(...) retrieve polygon raw data", () => {
        expect($polygon.$getRaw()).toStrictEqual(
          expect.objectContaining({
            length: undefined,
            polygon: undefined,
            radius: undefined,
            type: GraphicType.TRIANGLE,
            width: 45,
            height: 32,
            position: { x: 0, y: 0 },
          }),
        );
      });
      test("$destroy(...)", () => {
        expect($polygon.getFather()).toStrictEqual($container);
        $polygon.$destroy();
        expect($polygon.getFather).toStrictEqual(null);
      });
    });
  });
});
