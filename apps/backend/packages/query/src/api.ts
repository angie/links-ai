import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import { logger } from "logger";
import { ApiHandler } from "sst/node/api";

export const getAll = ApiHandler(
  async (
    event: APIGatewayProxyEventV2,
  ): Promise<APIGatewayProxyStructuredResultV2> => {
    logger.info("Getting all links", { event });
    return Promise.resolve({
      statusCode: 200,
    });
  },
);

export const getByCategory = ApiHandler(
  async (
    event: APIGatewayProxyEventV2,
  ): Promise<APIGatewayProxyStructuredResultV2> => {
    logger.info("Getting links by category", { event });
    return Promise.resolve({
      statusCode: 200,
    });
  },
);
