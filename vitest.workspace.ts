import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  "apps/*/vitest.config.mjs",
  "apps/backend/packages/*/vitest.config.mjs",
  "packages/*/vitest.config.mjs",
]);
