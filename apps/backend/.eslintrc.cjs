const path = require("node:path");

module.exports = {
  extends: ["custom/library"],
  parserOptions: {
    project: ["./tsconfig.json", "./tsconfig.eslint.json"],
  },
  ignorePatterns: ["**/sst-env.d.ts"],
  rules: {
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
  },
  overrides: [
    {
      files: ["./packages/core/**/*.ts"],
      parserOptions: {
        project: path.resolve(__dirname, "./packages/core/tsconfig.json"),
      },
    },
    {
      files: ["./packages/ingest/**/*.ts"],
      parserOptions: {
        project: path.resolve(__dirname, "./packages/ingest/tsconfig.json"),
      },
    },
    {
      files: ["./packages/query/**/*.ts"],
      parserOptions: {
        project: path.resolve(__dirname, "./packages/query/tsconfig.json"),
      },
    },
    {
      files: ["./packages/storage/**/*.ts"],
      parserOptions: {
        project: path.resolve(__dirname, "./packages/storage/tsconfig.json"),
      },
    },
  ],
};
