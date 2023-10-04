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
      pk: "string",
      sk: "string",
      gsi1pk: "string",
      gsi1sk: "string",
      gsi2pk: "string",
      gsi2sk: "string",
    },
    primaryIndex: {
      partitionKey: "pk",
      sortKey: "sk",
    },
    globalIndexes: {
      // by url
      gsi1: {
        partitionKey: "gsi1pk",
        sortKey: "gsi1sk",
      },
      // by category
      gsi2: {
        partitionKey: "gsi2pk",
        sortKey: "gsi2sk",
      },
    },
  });

  stack.addOutputs({
    TableName: appTable.tableName,
  });

  return { table: appTable };
}
