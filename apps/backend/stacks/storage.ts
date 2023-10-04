import { use } from "sst/constructs";
import { bus as busStack } from "./event-bus";
import { table as tableStack } from "./table";

export function linkStorage(): void {
  const { bus } = use(busStack);
  const { table } = use(tableStack);

  bus.subscribe("link.submitted", {
    handler: "packages/storage/src/events/submitted.handler",
    bind: [bus, table],
  });

  bus.subscribe("link.categorised", {
    handler: "packages/storage/src/events/categorised.handler",
    bind: [bus, table],
  });
}
