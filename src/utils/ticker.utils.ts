// import * as PIXI from "pixi.js";
// import { DisplayObjectEvent } from "../enums";
//
// export const createTicker = (
//   container: PIXI.Container,
//   callback: ({ deltaTime }: { deltaTime: number }) => void,
// ) => {
//   const add = () =>
//     PIXI.Ticker.shared.add(callback, this, PIXI.UPDATE_PRIORITY.HIGH);
//   const remove = () => {
//     PIXI.Ticker.shared.remove(callback);
//   };
//
//   container.on(DisplayObjectEvent.ADDED, add);
//   container.on(DisplayObjectEvent.REMOVED, remove);
//
//   if (container.parent) add();
//
//   return remove;
// };
