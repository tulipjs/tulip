import { Point } from "../point.types";
import { ComponentMutable } from "../component.types";
import { ContainerMutable, ContainerProps } from "./container.types";

export type WorldPhysics = {
  enabled?: boolean;
  gravity?: Point;
  velocity?: number;
};

export type WorldProps = {
  props?: {
    physics?: WorldPhysics;
  };
} & ContainerProps;

export type WorldMutable = {
  add: (displayObject: ComponentMutable) => void;
  remove: (displayObject: ComponentMutable) => void;
  setPhysicsEnabled: (enabled: boolean) => void;
} & ContainerMutable;
