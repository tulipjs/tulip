import { BodyMaterialProps } from "../../types";

export type CircleProps = {
  color: number;
  size: number;
  mass: number;
  material?: BodyMaterialProps;
};

export type BoxProps = {
  color: number;
  width: number;
  height: number;
  mass: number;
  material?: BodyMaterialProps;
};

export type CapsuleProps = {
  color: number;
  length: number;
  radius: number;
  mass: number;
  material?: BodyMaterialProps;
};
