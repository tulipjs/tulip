import * as PIXI from "pixi.js";
import { loadSpriteSheet as $loadSpriteSheet } from "../utils";

export const spritesheet = () => {
  let spriteSheetMap: Record<string, PIXI.Spritesheet> = {};

  const load = async (...spriteSheet: string[]) => {
    for (const $spriteSheet of spriteSheet)
      spriteSheetMap[$spriteSheet] = await $loadSpriteSheet($spriteSheet);
  };

  const get = (spriteSheet: string): PIXI.Spritesheet =>
    spriteSheetMap[spriteSheet];

  return {
    load,
    get,
  };
};
