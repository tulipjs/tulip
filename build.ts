import { build } from "deno_web_serve";
import { load } from "loadenv";

await load();

await build({
  indexFileName: "main.ts",
  minify: true,
  bundleAssets: true,
  envs: [],
});
