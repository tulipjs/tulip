import { ContainerProps } from "../components";
import { BodyMaterialProps } from "../../types";

export type CircleProps = {
  props: {
    color: number;
    size: number;
    mass: number;
    material?: BodyMaterialProps;
  };
} & ContainerProps;
