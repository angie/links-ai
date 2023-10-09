import shared from "vitest-config/node";
import { defineProject, mergeConfig } from "vitest/config";

// eslint-disable-next-line import/no-default-export -- required for vitest
export default mergeConfig(
  shared,
  defineProject({
    test: {
      environment: "node",
      threads: false,
    },
  }),
);
