import * as PIXI from "pixi.js";

export const loadTexture = async (texture: string): Promise<PIXI.Texture> => {
  const data = await fetch(texture);
  const blob = await data.blob();
  const imageBitmap = await createImageBitmap(blob);
  return PIXI.Texture.from(imageBitmap);
};
