import type { StackContext } from "sst/constructs";
import { use } from "sst/constructs";
import { bus as busStack } from "./event-bus";
import { table as tableStack } from "./table";

export function linkStorage({ stack }: StackContext): void {
  const { bus } = use(busStack);
  const { table } = use(tableStack);

  bus.subscribe("link.submitted", {
    handler: "packages/storage/src/events/submitted.handler",
    bind: [table],
  });

  stack.addOutputs({
    TableName: table.tableName,
  });
}
