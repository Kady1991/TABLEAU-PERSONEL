import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import http from "node:http";
import https from "node:https";

export default defineConfig({
  plugins: [react()],
  base: "/PersonnelTest/",
  server: {
    proxy: {
      "/api": {
        target: "https://server-iis.uccle.intra/APIPersonnelTest", //'https://server-iis.uccle.intra/APIPersonnelUccleTest'
        changeOrigin: true,
        secure: false,
        agent: new https.Agent({ keepAlive: true }),
      },
    },
  },
});
