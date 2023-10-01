import type { StackContext } from "sst/constructs";
import { Api, use } from "sst/constructs";
import { bus as busStack } from "./event-bus";
import { table as tableStack } from "./table";

export function linkCategorisation({ stack }: StackContext): void {
  const { bus } = use(busStack);
  const { table } = use(tableStack);

  const api = new Api(stack, "link-categorisation-api", {
    defaults: {
      function: {
        bind: [bus, table],
      },
    },
    routes: {
      "GET /links/category/{category}":
        "packages/link-categorisation/src/api.getByCategory",
    },
  });

  bus.subscribe("link.created", {
    handler: "packages/links/src/events/created.handler",
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
