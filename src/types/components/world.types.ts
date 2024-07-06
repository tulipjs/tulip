import { Point } from "../point.types";
import { ComponentMutable } from "../component.types";
import p2 from "p2";
import { ContainerMutable } from "./container.types";

export type WorldPhysics = {
  enabled?: boolean;
  gravity?: Point;
  velocity?: number;
};

export type PartialWorldProps = {
  props?: {
    physics?: WorldPhysics;
  };
};

export type PartialWorldMutable = {
  add: (
    ...displayObject: ComponentMutable<unknown, unknown, unknown>[]
  ) => void;
  remove: (
    ...displayObject: ComponentMutable<unknown, unknown, unknown>[]
  ) => void;

  setPhysicsEnabled: (enabled: boolean) => void;
  getPhysicsEnabled: () => boolean;

  $getWorld: () => p2.World;
};

export type WorldMutable = ContainerMutable & PartialWorldMutable;
