import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import { logger } from "logger";
import { ApiHandler } from "sst/node/api";
import { getAllLinks } from "./data";

export const getAll = ApiHandler(
  async (
    _event: APIGatewayProxyEventV2,
  ): Promise<APIGatewayProxyStructuredResultV2> => {
    logger.info("Getting all links");

    const links = await getAllLinks();

    return Promise.resolve({
      statusCode: 200,
      body: JSON.stringify(links, null, 2),
    });
  },
);

export const getById = ApiHandler(
  async (
    event: APIGatewayProxyEventV2,
  ): Promise<APIGatewayProxyStructuredResultV2> => {
    logger.info("Getting link by id", { event });
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
