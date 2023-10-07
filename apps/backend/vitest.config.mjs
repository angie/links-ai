import path from "node:path";
import shared from "vitest-config/node";
import { defineProject, mergeConfig } from "vitest/config";

// eslint-disable-next-line import/no-default-export -- required for vitest
export default mergeConfig(
  shared,
  defineProject({
    test: {
      environment: "node",
      threads: false,
      globalSetup: "./vitest.globals.mjs",
    },
    resolve: {
      alias: {
        "@backend/core": path.resolve(__dirname, "./packages/core/src"),
      },
    },
  }),
);
