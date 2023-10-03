import type { App } from "sst/constructs";
import { bus } from "./event-bus";
import { linkCategorisation } from "./categorisation";
import { linkIngest } from "./ingest";
import { table } from "./table";
import { linkStorage } from "./storage";

/**
 * Add all stacks to the app. Used to keep sst.config.ts and tests in lockstep.
 * @param app - The SST app to add stacks to.
 */
export function addAppStacks(app: App): void {
  app.stack(bus);
  app.stack(table);
  app.stack(linkCategorisation);
  app.stack(linkIngest);
  app.stack(linkStorage);
}
