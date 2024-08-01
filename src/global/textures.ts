import * as PIXI from "pixi.js";
import { loadTexture } from "../utils";

export const textures = () => {
  let texturesMap: Record<string, PIXI.Texture> = {};

  const load = async (...textures: string[]) => {
    for (const $texture of textures) {
      if (texturesMap[$texture]) {
        console.warn(`Texture (${$texture}) already loaded!`);
        continue;
      }
      texturesMap[$texture] = await loadTexture($texture);
    }
  };

  const get = (texture: string): PIXI.Texture => {
    if (!texturesMap[texture]) throw `Texture (${texture}) not loaded!`;
    return texturesMap[texture];
  };

  return {
    load,
    get,
  };
};
