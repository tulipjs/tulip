import * as PIXI from "pixi.js";
import { loadTexture } from "../utils";
import { GlobalTexturesType, TexturesLoadProps } from "../types";

export const textures = (): GlobalTexturesType => {
  let texturesMap: Record<string, PIXI.Texture> = {};

  const load = async ({ textures, onLoad }: TexturesLoadProps) => {
    const promiseList = [];
    for (const $texture of textures) {
      if (texturesMap[$texture]) {
        console.warn(`Texture (${$texture}) already loaded!`);
        continue;
      }
      texturesMap[$texture] = await loadTexture($texture);
      promiseList.push(onLoad?.($texture));
    }
    await Promise.all(promiseList);
  };

  const loadRaw = async (key: string, texture: string) => {
    texturesMap[key] = await loadTexture(texture);
  };

  const get = (texture: string): PIXI.Texture => {
    if (!texturesMap[texture]) throw `Texture (${texture}) not loaded!`;
    return texturesMap[texture];
  };

  return {
    load,
    loadRaw,
    get,
  };
};
