import * as PIXI from "pixi.js";

export const loadSpriteSheet = (
  spriteSheet: string,
): Promise<PIXI.Spritesheet> =>
  new Promise<PIXI.Spritesheet>((resolve) => {
    fetch(spriteSheet)
      .then((data) => data.json())
      .then(async (data) => {
        const imagePath = `${spriteSheet.split("/").reverse().slice(1).reverse()}/${data.meta.image}`;

        const $spriteSheet = new PIXI.Spritesheet(
          await PIXI.Assets.load(imagePath),
          data,
        );
        await $spriteSheet.parse();

        resolve($spriteSheet);
      });
  });
