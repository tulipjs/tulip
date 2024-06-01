import * as PIXI from "pixi.js";

export type Container = PIXI.Container;
export type Graphics = PIXI.Graphics;
export type Sprite = PIXI.Sprite;

export type DisplayObject = (Container | Graphics | Sprite) & {
	id?: string
};

export type Texture = typeof PIXI.Texture;
