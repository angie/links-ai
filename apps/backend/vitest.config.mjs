import shared from "vitest-config/node";
import { configDefaults, defineProject, mergeConfig } from "vitest/config";

// eslint-disable-next-line import/no-default-export -- required for vitest
export default mergeConfig(
  shared,
  defineProject({
    test: {
      environment: "node",
      exclude: [...configDefaults.exclude, "packages/**"],
    },
  }),
);
