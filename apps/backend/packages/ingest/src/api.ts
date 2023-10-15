import { DataError } from "@backend/core/errors";
import { Events } from "@backend/core/events";
import { createApiResponse } from "@backend/core/response-helper";
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import { logger } from "logger";
import { ApiHandler } from "sst/node/api";
import invariant from "tiny-invariant";
import { ulid } from "ulid";
import { markDeleted } from "./data";

interface EventBody {
  url: string;
}

export const create = ApiHandler(
  async (
    event: APIGatewayProxyEventV2,
  ): Promise<APIGatewayProxyStructuredResultV2> => {
    const id = ulid();

    invariant(event.body, "Missing body");

    const body = JSON.parse(event.body) as EventBody;

    if (!body.url) {
      return createApiResponse({
        statusCode: 400,
        body: { error: "Missing url" },
      });
    }

    const { url } = body;

    await Events.Submitted.publish({
      id,
      url,
    });

    logger.info("Link created", { url });

    return createApiResponse({
      statusCode: 202,
      body: { id },
    });
  },
);

export function archive(): void {
  logger.info("Link archived");
}

export const remove = ApiHandler(
  async (
    event: APIGatewayProxyEventV2,
  ): Promise<APIGatewayProxyStructuredResultV2> => {
    invariant(event.pathParameters, "Missing path parameters");
    invariant(event.pathParameters.id, "Missing id");

    const id = event.pathParameters.id;

    try {
      await markDeleted(id);

      await Events.Removed.publish({
        id,
      });

      logger.info("Link removed", { id });

      return createApiResponse({
        statusCode: 202,
        body: { id },
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
        body: { error: "Failed to get link by id", rawError: error },
      });
    }
  },
);
