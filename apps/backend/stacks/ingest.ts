import type { StackContext } from "sst/constructs";
import { Api, use } from "sst/constructs";
import { bus as busStack } from "./event-bus";
import { table as tableStack } from "./table";

export function linkIngest({ stack }: StackContext): void {
  const { bus } = use(busStack);
  const { table } = use(tableStack);

  const api = new Api(stack, "ingest-api", {
    defaults: {
      function: {
        bind: [bus, table],
      },
    },
    routes: {
      "PATCH /links/{linkId}": "packages/ingest/src/api.archive",
      "POST /submit": "packages/ingest/src/api.create",
      "DELETE /links/{linkId}": "packages/ingest/src/api.remove",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    TableName: table.tableName,
  });
}
