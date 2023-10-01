import type { StackContext } from "sst/constructs";
import { Api, use } from "sst/constructs";
import { bus as busStack } from "./event-bus";
import { table as tableStack } from "./table";

export function links({ stack }: StackContext): void {
  const { bus } = use(busStack);
  const { table } = use(tableStack);

  const api = new Api(stack, "links-api", {
    defaults: {
      function: {
        bind: [bus, table],
      },
    },
    routes: {
      "GET /": "packages/links/src/lambda.handler",
      "GET /links": "packages/links/src/api.list",
      "POST /links": "packages/links/src/api.create",
    },
  });

  bus.subscribe("link.created", {
    handler: "packages/links/src/events/created.handler",
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    TableName: table.tableName,
  });
}
