import type { StackContext } from "sst/constructs";
import { Api, Function, use } from "sst/constructs";
import { bus as busStack } from "./event-bus";
import { secrets } from "./secrets";
import { table as tableStack } from "./table";

export function linkIngest({ stack }: StackContext): void {
  const { bus } = use(busStack);
  const { table } = use(tableStack);
  const { SECURE_TOKEN } = use(secrets);

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
          bind: [SECURE_TOKEN],
        }),
      },
    },
  });

  stack.addOutputs({
    IngestApiEndpoint: api.url,
  });
}
