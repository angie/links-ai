import type { StackContext } from "sst/constructs";
import { Api, use } from "sst/constructs";
import { bus as busStack } from "./event-bus";
import { table as tableStack } from "./table";

export function linkQuery({ stack }: StackContext): void {
  const { bus } = use(busStack);
  const { table } = use(tableStack);

  const api = new Api(stack, "query-api", {
    defaults: {
      function: {
        bind: [bus, table],
      },
    },
    routes: {
      "GET /links": "packages/query/src/api.getAll",
      "GET /links/{id}": "packages/query/src/api.getById",
      "GET /links/category/{category}": "packages/query/src/api.getByCategory",
    },
  });

  stack.addOutputs({
    QueryApiEndpoint: api.url,
  });
}
