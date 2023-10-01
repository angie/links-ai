import type { StackContext } from "sst/constructs";
import { Api, use } from "sst/constructs";
import { bus as busStack } from "./event-bus";
import { table as tableStack } from "./table";

export function linkSubmission({ stack }: StackContext): void {
  const { bus } = use(busStack);
  const { table } = use(tableStack);

  const api = new Api(stack, "link-submission-api", {
    defaults: {
      function: {
        bind: [bus, table],
      },
    },
    routes: {
      "PATCH /links/{linkId}": "packages/link-submission/src/api.archive",
      "POST /submit": "packages/link-submission/src/api.create",
      "DELETE /links/{linkId}": "packages/link-submission/src/api.remove",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    TableName: table.tableName,
  });
}
