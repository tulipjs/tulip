import { ContainerMutable, ContainerProps, Component } from "../../types";
import { container as containerComponent } from "../container.component";
import { body } from "./body.component";
import { planeShape } from "./shapes";
import { graphics } from "../graphics.component";

export const plane: Component<ContainerProps, ContainerMutable, false> = (
  props,
) => {
  const container = containerComponent(props);

  const _body = body({ angle: props.angle });
  const _planeShape = planeShape();
  _body.addShape(_planeShape);

  container.setBody(_body);

  const _graphics = graphics({
    angle: props.angle,
    color: 0xff0000,
  });
  _graphics.setPolygon([0, 0, 10000, 0, 10000, 5, 0, 5]);
  _graphics.setPivot({ x: 5000, y: 2.5 });
  container.add(_graphics);

  return container;
};
