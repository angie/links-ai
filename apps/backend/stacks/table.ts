import type { StackContext } from "sst/constructs";
import { Table, use } from "sst/constructs";
import { bus as busStack } from "./event-bus";

export function table({ stack }: StackContext): { table: Table } {
  const { bus } = use(busStack);
  const appTable = new Table(stack, "app-table", {
    defaults: {
      function: {
        bind: [bus],
      },
    },
    fields: {
      id: "string",
      url: "string",
      summary: "string",
      timestamp: "string",
      archived: "string",
      deleted: "string",
    },
    primaryIndex: {
      partitionKey: "id",
    },
  });

  stack.addOutputs({
    TableName: appTable.tableName,
  });

  return { table: appTable };
}
