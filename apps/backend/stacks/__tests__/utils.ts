import { initProject } from "sst/project";

const APP_DIR = "apps/backend";
const IS_RUNNING_FROM_MONOREPO = !process.cwd().includes(APP_DIR);

// helper for setting sst project root depending on whether we're running from monorepo root or not
// TODO: find out how to set the root path relative to the package, not monorepo root
const PROJECT_ROOT = IS_RUNNING_FROM_MONOREPO
  ? `${process.cwd()}/${APP_DIR}`
  : process.cwd();

export const initSstProject = async (): Promise<
  ReturnType<typeof initProject>
> => {
  await initProject({
    root: PROJECT_ROOT,
    stage: "test",
  });
};
