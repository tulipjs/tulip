import { defineConfig } from "vite";
import alias from "@rollup/plugin-alias";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";

const projectRootDir = resolve(__dirname);

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    alias({
      entries: [
        {
          find: "@",
          replacement: resolve(projectRootDir, "../../src"),
        },
      ],
    }),
  ],
  publicDir: "assets",
});
