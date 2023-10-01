import type { SSTConfig } from "sst";
import { API } from "./stacks/my-stack";
import { links } from "./stacks/links";

const config: SSTConfig = {
  config(_input) {
    return {
      name: "backend",
      region: "eu-west-2",
    };
  },
  stacks(app) {
    app.stack(API);
    app.stack(links);

    app.setDefaultFunctionProps({
      runtime: "nodejs18.x",
    });
  },
};

// eslint-disable-next-line import/no-default-export -- required by SST
export default config;
