import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { plugin } from "@darkaqua/vite-tulip";

export default defineConfig({
  server: {
    port: 4194,
  },
  plugins: [tsconfigPaths(), plugin()],
  publicDir: "assets",
});
