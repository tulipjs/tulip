import * as PIXI from "pixi.js";

export type Container = PIXI.Container;
export type Graphics = PIXI.Graphics;
export type Sprite = PIXI.Sprite;
export type NineSliceSprite = PIXI.NineSliceSprite;
export type AnimatedSprite = PIXI.AnimatedSprite;
export type Text = PIXI.Text;

export type DisplayObject =
  | Container
  | Graphics
  | Sprite
  | NineSliceSprite
  | AnimatedSprite
  | Text;

export type Texture = typeof PIXI.Texture;
