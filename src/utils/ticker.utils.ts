import * as PIXI from "pixi.js";

export const createTicker = (
  container: PIXI.Container,
  callback: ({ deltaTime }: { deltaTime: number }) => void,
) => {
  const add = () => PIXI.Ticker.shared.add(callback);
  const remove = () => {
    PIXI.Ticker.shared.remove(callback);
  };

  container.on("added", add);
  container.on("removed", remove);

  if (container.parent) add();

  return remove;
};
