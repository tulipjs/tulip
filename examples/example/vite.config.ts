import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { plugin } from "@tulib/vite-tulip-plugin";

export default defineConfig({
  server: {
    port: 4194,
    open: true,
  },
  plugins: [tsconfigPaths(), plugin()],
  publicDir: "assets",
});
