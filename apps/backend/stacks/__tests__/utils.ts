import { App } from "sst/constructs";
import { initProject } from "sst/project";
import { bus } from "../event-bus";
import { links } from "../links";
import { table } from "../table";

const APP_DIR = "apps/backend";
const IS_RUNNING_FROM_MONOREPO = !process.cwd().includes(APP_DIR);

// helper for setting sst project root depending on whether we're running from monorepo root or not
// TODO: find out how to set the root path relative to the package, not monorepo root
const PROJECT_ROOT = IS_RUNNING_FROM_MONOREPO
  ? `${process.cwd()}/${APP_DIR}`
  : process.cwd();

export const initProjectWithStacks = async (): Promise<App> => {
  await initProject({
    root: PROJECT_ROOT,
    stage: "test",
  });

  const app = new App({ mode: "deploy", stage: "test" });
  app.stack(bus);
  app.stack(table);
  app.stack(links);

  return app;
};
