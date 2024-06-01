import { application } from "@darkaqua/tulip";
import { app } from "./app";

application({
  backgroundColor: 0xff00ff,
  antialias: true,
  sharedTicker: true,
}).then(async ({ add }) => {
  add(await app());
});
