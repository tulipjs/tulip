import { serveGame } from "game_serve";
import { load } from "loadenv";

await load();
await serveGame();
