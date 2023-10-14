import type { StackContext } from "sst/constructs";
import { Function, Api, use } from "sst/constructs";
import { bus as busStack } from "./event-bus";
import { table as tableStack } from "./table";

export function linkIngest({ stack }: StackContext): void {
  const { bus } = use(busStack);
  const { table } = use(tableStack);

  const api = new Api(stack, "ingest-api", {
    defaults: {
      authorizer: "Authorizer",
      function: {
        bind: [bus, table],
      },
    },
    routes: {
      "PATCH /links/{id}": "packages/ingest/src/api.archive",
      "POST /submit": "packages/ingest/src/api.create",
      "DELETE /links/{id}": "packages/ingest/src/api.remove",
    },
    authorizers: {
      Authorizer: {
        type: "lambda",
        function: new Function(stack, "ingest-api-authorizer", {
          handler: "packages/ingest/src/authorizer.handler",
        }),
      },
    },
  });

  stack.addOutputs({
    IngestApiEndpoint: api.url,
  });
}
