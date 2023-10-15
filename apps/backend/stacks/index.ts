import type { App } from "sst/constructs";
import { linkCategorisation } from "./categorisation";
import { bus } from "./event-bus";
import { linkIngest } from "./ingest";
import { linkQuery } from "./query";
import { secrets } from "./secrets";
import { linkStorage } from "./storage";
import { table } from "./table";

/**
 * Add all stacks to the app. Used to keep sst.config.ts and tests in lockstep.
 * @param app - The SST app to add stacks to.
 */
export function addAppStacks(app: App): void {
  app.stack(bus);
  app.stack(table);
  app.stack(secrets);
  app.stack(linkCategorisation);
  app.stack(linkIngest);
  app.stack(linkStorage);
  app.stack(linkQuery);
}
