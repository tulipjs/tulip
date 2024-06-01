import * as PIXI from "../libs/pixi.mjs";

export type Container = typeof PIXI.Container;
export type Graphics = typeof PIXI.Graphics;
export type Sprite = typeof PIXI.Sprite;

export type DisplayObject = Container | Graphics | Sprite;

export type Texture = typeof PIXI.Texture;
