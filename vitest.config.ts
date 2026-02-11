import path from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    include: ["src/**/*.(test|spec).*"],
    exclude: ["**/node_modules/**"],
    environment: "jsdom",
    coverage: {
      include: ["src/**"],
      exclude: [
        "**/index.*",
        "src/__tests__/**",
        "**/__mocks__/**",
        "**/*.test.*",
      ],
    },
  },
});
