import { expect, test } from "@jest/globals";
import { body } from "../body.sub-component";
import { Shape } from "../../../enums";
import { degreesToRadians } from "../../../utils";

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
      test("setPosition(...) to assign inverted positions on the body", () => {
        $body.setPosition({ x: 123, y: 321 });
        expect($body.getPosition()).toStrictEqual({
          x: 123,
          y: 321,
        });
        expect($body.$getBody().position).toStrictEqual([-123, -321]);
      });
      test("setAngle(...) and check if radians are correct", () => {
        $body.setAngle(46);
        expect($body.getAngle()).toStrictEqual(46);
        expect($body.$getBody().angle).toStrictEqual(degreesToRadians(46));
      });
      test("addForce(...) to be changed on the body", () => {
        $body.addForce({ x: 10, y: 20 });
        expect($body.$getBody().force).toStrictEqual([10, 20]);
      });
      test("addForceX(...) to be changed on the body", () => {
        $body.addForceX(12);
        expect($body.$getBody().force[0]).toStrictEqual(12);
      });
      test("addForceY(...) to be changed on the body", () => {
        $body.addForceY(56);
        expect($body.$getBody().force[1]).toStrictEqual(56);
      });
      test("setMass(...) to be changed on the body", () => {
        $body.setMass(555);
        expect($body.$getBody().mass).toStrictEqual(555);
        expect($body.getMass()).toStrictEqual(555);
      });
      test("setVelocity(...) to be changed on the body", () => {
        $body.setVelocity({ x: 12, y: -34 });
        expect($body.$getBody().velocity).toStrictEqual([12, -34]);
      });
      test("$getContactBody(...) check that the contact material is valid", () => {
        const $newBody = body();

        const contactMaterial = $body.$getContactBody($newBody);

        expect(contactMaterial.materialA).toStrictEqual($body.$getMaterial());
        expect(contactMaterial.materialB).toStrictEqual(
          $newBody.$getMaterial(),
        );

        expect(contactMaterial.surfaceVelocity).toStrictEqual(1);
        expect(contactMaterial.friction).toStrictEqual(2);
        expect(contactMaterial.restitution).toStrictEqual(3);
        expect(contactMaterial.frictionRelaxation).toStrictEqual(4);
        //@ts-ignore https://github.com/DefinitelyTyped/DefinitelyTyped/pull/69887
        expect(contactMaterial.frictionStiffness).toStrictEqual(5);
        expect(contactMaterial.relaxation).toStrictEqual(6);
        expect(contactMaterial.stiffness).toStrictEqual(7);
      });
    });
  });
});
