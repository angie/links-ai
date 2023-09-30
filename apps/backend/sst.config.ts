import type { SSTConfig } from "sst";
import { API } from "./stacks/my-stack";

// eslint-disable-next-line import/no-default-export -- required by SST
export default {
  config(_input) {
    return {
      name: "backend",
      region: "eu-west-2",
    };
  },
  stacks(app) {
    app.stack(API);
  },
} satisfies SSTConfig;
