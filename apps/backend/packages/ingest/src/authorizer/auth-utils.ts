import crypto from "node:crypto";
import type {
  APIGatewayAuthorizerResult,
  CustomAuthorizerEvent,
} from "aws-lambda";
import { Config } from "sst/node/config";

const TIME_WINDOW = 1 * 60 * 1000; // 1 minutes

const verifyHmac = (
  receivedHmac: string,
  payload: string,
  secret: string,
): boolean => {
  const timestampStr = payload.split("-")[2];
  const timestamp = parseInt(timestampStr, 10);

  // Calculate time difference
  const currentTime = Date.now();
  const timeDifference = currentTime - timestamp;

  // Check if within time window
  if (timeDifference < 0 || timeDifference > TIME_WINDOW) {
    return false;
  }

  // Generate HMAC
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(payload);
  const expectedHmac = hmac.digest("hex");

  // Verify HMAC
  return crypto.timingSafeEqual(
    Buffer.from(receivedHmac, "hex"),
    Buffer.from(expectedHmac, "hex"),
  );
};

export const generatePolicy = (
  principalId: string,
  effect: string,
  resource: string,
): APIGatewayAuthorizerResult => {
  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
};

export const generatePolicyInCI = (
  event: CustomAuthorizerEvent,
): Promise<APIGatewayAuthorizerResult> => {
  // @ts-expect-error -- TODO: why aren't SST types being picked up?
  const secureToken = Config.SECURE_TOKEN as string;
  const { "h-xmac": requestHmac = "", "x-payload": requestToken = "" } =
    event.headers ?? {};

  const isValid = verifyHmac(requestHmac, requestToken, secureToken);

  return isValid
    ? Promise.resolve(generatePolicy("user", "Allow", event.methodArn))
    : Promise.resolve(generatePolicy("user", "Deny", event.methodArn));
};

export const isRequestFromCI = (
  headers: CustomAuthorizerEvent["headers"],
): boolean => {
  const { "h-xmac": requestHmac = "", "x-payload": requestToken = "" } =
    headers ?? {};

  return (
    process.env.NODE_ENV !== "production" &&
    Boolean(requestHmac) &&
    Boolean(requestToken)
  );
};
