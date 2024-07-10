import { Point } from "../point.types";
import { ComponentMutable } from "./component.types";
import p2 from "p2";
import {
  ContainerComponent,
  ContainerMutable,
  ContainerProps,
} from "./container.types";

export type WorldPhysics = {
  enabled?: boolean;
  gravity?: Point;
  velocity?: number;
};

export type PartialWorldProps<Props = {}> = {
  physics?: WorldPhysics;
} & Props;

export type PartialWorldMutable<Mutable = {}> = {
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

////////////////////////////
export type WorldProps<Props = {}, Data = {}> = ContainerProps<
  PartialWorldProps<Props>,
  Data
>;

export type WorldMutable<
  Props = {},
  Mutable = {},
  Data = {},
> = ContainerMutable<
  WorldProps<Props, Data>,
  PartialWorldMutable<Mutable>,
  Data
>;

////////////////////////////
export type WorldComponent<
  Props = {},
  Mutable = {},
  Data = {},
> = ContainerComponent<
  WorldProps<Props, Data>,
  WorldMutable<Props, Mutable, Data>,
  Data
>;
