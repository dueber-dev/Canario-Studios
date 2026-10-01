import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  output: "static",
  devToolbar: { enabled: false },
  server: { headers: { "Permissions-Policy": "picture-in-picture=()" } },
  vite: { plugins: [tailwindcss()] },
});
