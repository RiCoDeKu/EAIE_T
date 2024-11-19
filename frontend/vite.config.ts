import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "localhost", // ホストを指定
    port: 3000, // ポートを指定
    strictPort: true, // ポートが使用中の場合、エラーを出す
  },
});
