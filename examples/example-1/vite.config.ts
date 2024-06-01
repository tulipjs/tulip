import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    port: 4194
  },
  plugins: [
    tsconfigPaths(),
  ],
  publicDir: "assets",
});
