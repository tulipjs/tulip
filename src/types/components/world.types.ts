import { Point } from "../point.types";
import { ComponentMutable } from "../component.types";
import { ContainerMutable, ContainerProps } from "./container.types";

export type WorldProps = {
  gravity?: Point;
  velocity?: number;
} & ContainerProps;

export type WorldMutable = {
  add: (displayObject: ComponentMutable) => void;
  remove: (displayObject: ComponentMutable) => void;
} & ContainerMutable;
