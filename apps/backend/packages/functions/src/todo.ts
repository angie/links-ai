import * as Todo from "@backend/core/todo";
import type { APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { ApiHandler } from "sst/node/api";

export const create = ApiHandler(async (_evt) => {
  await Todo.create();

  return {
    statusCode: 200,
    body: "Todo created",
  };
});

export const list = ApiHandler(
  async (_evt): Promise<APIGatewayProxyStructuredResultV2> => {
    return Promise.resolve({
      statusCode: 200,
      body: JSON.stringify(Todo.list()),
    });
  },
);
