import * as PIXI from "pixi.js";
import { global } from "./global";
import { GlobalSpriteSheetsType, SpriteSheetsLoadProps } from "../types";

export const spriteSheets = (): GlobalSpriteSheetsType => {
  let spriteSheetMap: Record<string, PIXI.Spritesheet> = {};

  const $loadSpriteSheet = (spriteSheet: string): Promise<PIXI.Spritesheet> =>
    new Promise<PIXI.Spritesheet>((resolve) => {
      fetch(spriteSheet)
        .then((data) => data.json())
        .then(async (data) => {
          const imagePath = `${spriteSheet.split("/").reverse().slice(1).reverse().join("/")}/${data.meta.image}`;

          await global.textures.load({ textures: [imagePath] });
          const $spriteSheet = new PIXI.Spritesheet(
            global.textures.get(imagePath),
            data,
          );
          await $spriteSheet.parse();

          resolve($spriteSheet);
        });
    });

  const load = async ({ spriteSheet, onLoad }: SpriteSheetsLoadProps) => {
    const promiseList = [];
    for (const $spriteSheet of spriteSheet) {
      if (spriteSheetMap[$spriteSheet]) {
        console.warn(`SpriteSheet (${spriteSheet}) already loaded!`);
        continue;
      }
      spriteSheetMap[$spriteSheet] = await $loadSpriteSheet($spriteSheet);
      promiseList.push(onLoad?.($spriteSheet));
    }
    await Promise.all(promiseList);
  };

  const get = (spriteSheet: string): PIXI.Spritesheet => {
    if (!spriteSheetMap[spriteSheet])
      throw `SpriteSheet (${spriteSheet}) not loaded!`;
    return spriteSheetMap[spriteSheet];
  };

  return {
    load,
    get,
  };
};
