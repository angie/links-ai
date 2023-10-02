import { Events } from "@backend/core/events";
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import { logger } from "logger";
import { ApiHandler } from "sst/node/api";
import invariant from "tiny-invariant";
import { ulid } from "ulid";

export const create = ApiHandler(
  async (
    event: APIGatewayProxyEventV2,
  ): Promise<APIGatewayProxyStructuredResultV2> => {
    const id = ulid();

    invariant(event.body, "Missing body");

    const url = JSON.parse(event.body).url;

    if (!url) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Missing url",
        }),
      };
    }

    await Events.Submitted.publish({
      id,
      url,
    });

    logger.info("Link created", { url });

    return {
      statusCode: 202,
      body: JSON.stringify({
        id,
      }),
    };
  },
);

export function archive(): void {
  logger.info("Link archived");
}

export function remove(): void {
  logger.info("Link removed");
}
