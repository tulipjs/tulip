import { application } from "@darkaqua/tulip";
import { app } from "./app";

application({
  backgroundColor: 0xff00ff,
  scale: 3,
}).then(async ({ add }) => {
  add(await app());
});
