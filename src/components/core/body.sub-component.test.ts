import { expect, test } from "@jest/globals";
import { body } from "./body.sub-component";
import { Shape } from "../../enums";

describe("sub-components", () => {
  describe("core", () => {
    describe("body", () => {
      let $body = body({
        mass: 99,
        angle: 34,
        material: {
          surfaceVelocity: 1,
          friction: 2,
          restitution: 3,
          frictionRelaxation: 4,
          frictionStiffness: 5,
          relaxation: 6,
          stiffness: 7,
        },
        position: {
          x: 10,
          y: 12,
        },
      });

      let shapeId: number;
      test("addShape(...) to add a shape to the body and add the material", () => {
        shapeId = $body.addShape({
          type: Shape.BOX,
          height: 10,
          width: 20,
        });

        const foundShapeMutable = $body
          .$getShapes()
          .find(({ id }) => id === shapeId);
        expect(foundShapeMutable).not.toBe(undefined);

        const foundShape = $body
          .$getBody()
          .shapes.find(({ id }) => id === shapeId);
        expect(foundShape).not.toBe(undefined);

        expect(foundShape.material).toBe($body.$getMaterial());
      });
      test("removeShape(...) to remove a shape from the body", () => {
        $body.removeShape(shapeId);

        const foundShapeMutable = $body
          .$getShapes()
          .find(({ id }) => id === shapeId);
        expect(foundShapeMutable).toBe(undefined);

        const foundShape = $body
          .$getBody()
          .shapes.find(({ id }) => id === shapeId);
        expect(foundShape).toBe(undefined);
      });
      test.todo("setPosition(...)");
      test.todo("getPosition()");
      test.todo("setAngle(...)");
      test.todo("getAngle(...)");
      test.todo("addForce(...)");
      test.todo("addForceX(...)");
      test.todo("addForceY(...)");
      test.todo("$getContactBody(...)");
    });
  });
});
