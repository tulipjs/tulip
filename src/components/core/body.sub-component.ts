import p2 from "p2";
import {
  BodyMutable,
  BodyProps,
  Point,
  Shapes,
  SubComponent,
} from "../../types";
import { degreesToRadians, getShape, radiansToDegrees } from "../../utils";

export const body: SubComponent<BodyProps, BodyMutable> = ({
  mass,
  angle,

  material = {
    friction: 0.3,
    restitution: 0,
    surfaceVelocity: 0,
  },
} = {}) => {
  const $body = new p2.Body({
    mass: mass,
    angle: angle ? degreesToRadians(angle) : 0,
  });

  const $materialProps = structuredClone(material);
  const $material = new p2.Material();

  const $getContactBody = (bodyMutable: BodyMutable) =>
    new p2.ContactMaterial($material, bodyMutable.$getMaterial(), {
      ...$materialProps,
    });
  const $getMaterial = () => $material;
  const $getBody = () => $body;

  const addShape = <Shape extends Shapes>(shapeProps: Shape): number => {
    const shape = getShape(shapeProps);
    shape.material = $material;
    $body.addShape(shape);
    return shape.id;
  };
  const removeShape = (shapeId: number) => {
    $body.removeShape($body.shapes.find((shape) => shape.id === shapeId));
  };

  const setPosition = (position: Point) => {
    $body.position = [-position?.x || 0, -position?.y || 0];
  };
  const getPosition = (): Point => ({
    x: -$body.position[0],
    y: -$body.position[1],
  });

  const getAngle = (): number => radiansToDegrees($body.angle);
  const setAngle = (angle: number) => ($body.angle = degreesToRadians(angle));

  const addForceX = (force: number) => ($body.force[0] = force);
  const addForceY = (force: number) => ($body.force[1] = force);
  const addForce = (force: Point) => ($body.force = [force.x, force.y]);

  return {
    addShape,
    removeShape,

    setPosition,
    getPosition,

    getAngle,
    setAngle,

    addForceX,
    addForceY,
    addForce,

    $getBody,
    $getMaterial,
    $getContactBody,
  };
};
