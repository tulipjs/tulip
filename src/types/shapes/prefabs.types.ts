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

export type BoxProps = {
  props: {
    color: number;
    width: number;
    height: number;
    mass: number;
    material?: BodyMaterialProps;
  };
} & ContainerProps;

export type CapsuleProps = {
  props: {
    color: number;
    length: number;
    radius: number;
    mass: number;
    material?: BodyMaterialProps;
  };
} & ContainerProps;
