import type { StackContext } from "sst/constructs";
import { Api, EventBus } from "sst/constructs";

export function links({ stack }: StackContext): void {
  const bus = new EventBus(stack, "links-bus", {
    defaults: {
      retries: 10,
    },
  });

  const api = new Api(stack, "links-api", {
    defaults: {
      function: {
        bind: [bus],
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
  });
}
