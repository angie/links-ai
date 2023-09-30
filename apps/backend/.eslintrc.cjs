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
};
