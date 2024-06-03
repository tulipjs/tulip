import { ContainerMutable, ContainerProps, Function } from "../../types";
import { container as containerComponent } from "../container.component";
import { body } from "./body.component";
import { planeShape } from "./shapes";

export const plane: Function<ContainerProps, ContainerMutable> = (props) => {
  const container = containerComponent(props);

  const _body = body();
  const _planeShape = planeShape();
  _body.addShape(_planeShape);

  container.setBody(_body);

  return {
    ...container,
  };
};
