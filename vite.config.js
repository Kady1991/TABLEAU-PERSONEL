import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://server-iis.uccle.intra/APIPersonnelTest",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
