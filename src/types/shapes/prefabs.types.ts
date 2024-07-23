import { BodyMaterialProps } from "../../types";

export type CircleProps = {
  size: number;
  mass: number;
  material?: BodyMaterialProps;
};

export type BoxProps = {
  width: number;
  height: number;
  mass: number;
  material?: BodyMaterialProps;
};

export type CapsuleProps = {
  length: number;
  radius: number;
  mass: number;
  material?: BodyMaterialProps;
};
