import * as PIXI from "pixi.js";
import { global } from "./global";

type LoadProps = {
  spriteSheet: string[];
  onLoad?: (name: string) => void;
};

export const spriteSheets = () => {
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

  const load = async ({ spriteSheet, onLoad }: LoadProps) => {
    for (const $spriteSheet of spriteSheet) {
      if (spriteSheetMap[$spriteSheet]) {
        console.warn(`SpriteSheet (${spriteSheet}) already loaded!`);
        continue;
      }
      spriteSheetMap[$spriteSheet] = await $loadSpriteSheet($spriteSheet);
      onLoad?.($spriteSheet);
    }
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
