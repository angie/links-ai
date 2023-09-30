const { defineProject, mergeConfig } = require("vitest/config");
const baseConfig = require("./base");

module.exports = mergeConfig(
  baseConfig,
  defineProject({
    test: {
      environment: "jsdom",
    },
  }),
);
