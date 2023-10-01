import type { StackContext } from "sst/constructs";
import { Api, EventBus, Table } from "sst/constructs";

export function links({ stack }: StackContext): void {
  const bus = new EventBus(stack, "bus", {
    defaults: {
      retries: 10,
    },
  });

  const table = new Table(stack, "links-table", {
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
