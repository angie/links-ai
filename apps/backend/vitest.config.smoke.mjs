import path from "node:path";
import shared from "vitest-config/node";
import { defineProject, mergeConfig } from "vitest/config";

// eslint-disable-next-line import/no-default-export -- required for vitest
export default mergeConfig(
  shared,
  defineProject({
    test: {
      environment: "node",
      exclude: ["./smoke-tests/**/*"],
      globalSetup: "./vitest.globals.mjs",
      threads: false,
    },
    resolve: {
      alias: {
        "@backend/core": path.resolve(__dirname, "./packages/core/src"),
      },
    },
  }),
);
