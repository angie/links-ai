import type { StackContext } from "sst/constructs";
import { Config, use } from "sst/constructs";
import { bus as busStack } from "./event-bus";
import { table as tableStack } from "./table";

export function linkCategorisation({ stack }: StackContext): void {
  const { bus } = use(busStack);
  const { table } = use(tableStack);

  const OPENAI_API_KEY = new Config.Secret(stack, "OPENAI_API_KEY");

  bus.subscribe("link.stored", {
    handler: "packages/categorisation/src/events/stored.handler",
    bind: [bus, table, OPENAI_API_KEY],
  });
}
