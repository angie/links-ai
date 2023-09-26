// tailwind config is required for editor support
import type { Config } from "tailwindcss";
import sharedConfig from "tailwind-config/tailwind.config";

const config: Pick<Config, "prefix" | "presets"> = {
  prefix: "ui-",
  presets: [sharedConfig],
};

// eslint-disable-next-line import/no-default-export -- needs to be default export
export default config;
