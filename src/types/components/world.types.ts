import { Point } from "../point.types";
import { ComponentMutable } from "./component.types";
import p2 from "p2";
import { ContainerComponent } from "./container.types";

export type WorldPhysics = {
  enabled?: boolean;
  gravity?: Point;
  velocity?: number;
};

export type WorldProps<Props = {}> = {
  physics?: WorldPhysics;
} & Props;

export type WorldMutable<Mutable = {}> = {
  add: (
    ...displayObject: ComponentMutable<unknown, unknown, unknown>[]
  ) => void;
  remove: (
    ...displayObject: ComponentMutable<unknown, unknown, unknown>[]
  ) => void;

  setPhysicsEnabled: (enabled: boolean) => void;
  getPhysicsEnabled: () => boolean;

  $getWorld: () => p2.World;
} & Mutable;

export type WorldComponent = ContainerComponent<WorldProps, WorldMutable>;
