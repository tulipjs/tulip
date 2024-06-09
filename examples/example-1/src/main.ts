import { application } from "@darkaqua/tulip";
import { app } from "./app";

application({
  backgroundColor: 0xff00ff,
}).then(async ({ add }) => {
  add(await app());
});
