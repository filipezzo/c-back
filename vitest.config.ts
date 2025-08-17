import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./src/tests/setup.ts"],

    coverage: {
      reportsDirectory: "./coverage",
      reporter: ["text", "html"],
    },
  },
});
