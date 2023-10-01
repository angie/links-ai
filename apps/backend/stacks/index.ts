import type { App } from "sst/constructs";
import { bus } from "./event-bus";
import { linkCategorisation } from "./link-categorisation";
import { linkSubmission } from "./link-submission";
import { table } from "./table";

/**
 * Add all stacks to the app. Used to keep sst.config.ts and tests in lockstep.
 * @param app - The SST app to add stacks to.
 */
export function addAppStacks(app: App): void {
  app.stack(bus);
  app.stack(table);
  app.stack(linkCategorisation);
  app.stack(linkSubmission);
}
