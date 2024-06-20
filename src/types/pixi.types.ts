import * as PIXI from "pixi.js";

export type Container = PIXI.Container;
export type Graphics = PIXI.Graphics;
export type Sprite = PIXI.Sprite;
export type AnimatedSprite = PIXI.AnimatedSprite;

export type DisplayObject = Container | Graphics | Sprite;

export type Texture = typeof PIXI.Texture;
