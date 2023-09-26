import { defineConfig, Options } from "tsup";

// eslint-disable-next-line import/no-default-export -- config needs to be default export
export default defineConfig((options: Options) => ({
  treeshake: true,
  splitting: true,
  entry: ["src/**/*.tsx"],
  format: ["esm"],
  dts: true,
  minify: true,
  clean: true,
  external: ["react"],
  ...options,
}));
