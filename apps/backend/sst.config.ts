import type { SSTConfig } from "sst";
import { bus } from "./stacks/event-bus";
import { links } from "./stacks/links";
import { table } from "./stacks/table";

const config: SSTConfig = {
  config(_input) {
    return {
      name: "backend",
      region: "eu-west-2",
    };
  },
  stacks(app) {
    app.stack(bus);
    app.stack(table);
    app.stack(links);

    app.setDefaultFunctionProps({
      runtime: "nodejs18.x",
    });
  },
};

// eslint-disable-next-line import/no-default-export -- required by SST
export default config;
