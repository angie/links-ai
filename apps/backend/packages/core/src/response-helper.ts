import type { APIGatewayProxyStructuredResultV2 } from "aws-lambda";

type ResponseBody = Record<string, unknown> | string | null;

interface ApiResponseOptions {
  statusCode: number;
  body?: ResponseBody;
  headers?: Record<string, string>;
}

export function createApiResponse({
  statusCode,
  body = null,
  headers = {},
}: ApiResponseOptions): APIGatewayProxyStructuredResultV2 {
  return {
    statusCode,
    headers,
    body: typeof body === "string" ? body : JSON.stringify(body, null, 2),
  };
}
