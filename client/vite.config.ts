import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import dotenv from "dotenv"; // this is a must to import env attributes
dotenv.config();
const proxy = process.env.VITE_PROXY_URL as string;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: proxy,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
