export type Point = { x: number; y: number };

export type Point3d = { z: number } & Point;

export enum Direction {
  LEFT,
  UP,
  RIGHT,
  DOWN,
}
