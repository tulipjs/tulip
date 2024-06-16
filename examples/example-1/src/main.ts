import { application } from "@tulib/tulip";
import { app } from "./app";

application({
  backgroundColor: 0xff00ff,
}).then(async ({ add }) => {
  add(await app());
});
