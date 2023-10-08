import { DataError } from "@backend/core/errors";
import { createApiResponse } from "@backend/core/response-helper";
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

    try {
      const links = await getAllLinks();

      return createApiResponse({
        statusCode: 200,
        body: links,
      });
    } catch (error) {
      if (error instanceof DataError) {
        return createApiResponse({
          statusCode: 500,
          body: { error: error.message },
        });
      }
      return createApiResponse({
        statusCode: 500,
        body: { error: "Failed to get all links", rawError: error },
      });
    }
  },
);

export const getByCategory = ApiHandler(
  async (
    event: APIGatewayProxyEventV2,
  ): Promise<APIGatewayProxyStructuredResultV2> => {
    logger.info("Getting links by category", { event });
    return Promise.resolve(
      createApiResponse({
        statusCode: 200,
      }),
    );
  },
);
