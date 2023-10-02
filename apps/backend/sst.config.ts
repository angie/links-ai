import type { SSTConfig } from "sst";
import { addAppStacks } from "./stacks";

const config: SSTConfig = {
  config(_input) {
    return {
      name: "backend",
      region: "eu-west-2",
    };
  },
  stacks(app) {
    addAppStacks(app);

    app.setDefaultFunctionProps({
      runtime: "nodejs18.x",
    });
  },
};

// eslint-disable-next-line import/no-default-export -- required by SST
export default config;
