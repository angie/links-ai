import type {
  APIGatewayAuthorizerResult,
  CustomAuthorizerEvent,
} from "aws-lambda";
import { logger } from "logger";
import {
  generatePolicy,
  generatePolicyInCI,
  isRequestFromCI,
} from "./auth-utils";

export const handler = (
  event: CustomAuthorizerEvent, // deprecated, but this is the type SST's using!
): Promise<APIGatewayAuthorizerResult> => {
  if (isRequestFromCI(event.headers)) {
    logger.debug("Authorizer request from CI", { event });
    return Promise.resolve(generatePolicyInCI(event));
  }
  const token = event.authorizationToken;

  logger.debug("Authorizer token", { token });

  // TODO: actually validate the token
  return Promise.resolve(generatePolicy("user", "Allow", event.methodArn));
};
