/// <reference lib="dom" />
import crypto from "node:crypto";
import { logger } from "logger";
import { Api } from "sst/node/api";
import { Config } from "sst/node/config";
import { expect, test } from "vitest";

function generatePayload(url: string): string {
  const method = "POST";
  const timestamp = Date.now();
  const nonce = crypto.randomBytes(16).toString("hex");

  const payload = `${url}-${method}-${timestamp}-${nonce}`;
  return payload;
}

function generateHmac(payload: string): string {
  // @ts-expect-error -- TODO: why aren't SST types being picked up?
  const secureToken = Config.SECURE_TOKEN as string;
  const hmac = crypto.createHmac("sha256", secureToken);
  hmac.update(payload);
  const signature = hmac.digest("hex");
  return signature;
}

test("should submit a link and categorise it", async () => {
  // @ts-expect-error -- TODO: why aren't SST types being picked up?
  const ingestApiUrl = `${Api["ingest-api"].url}/submit`;

  const payload = generatePayload(ingestApiUrl);
  const signature = generateHmac(payload);

  // submit a link
  const ingestResponse = await fetch(ingestApiUrl, {
    method: "POST",
    headers: {
      authorization: "Bearer 1234",
      "content-type": "application/json",
      "x-payload": payload,
      "x-hmac": signature,
    },
    body: JSON.stringify({ url: "https://example.com" }),
  });
  const ingestResponseJson = await ingestResponse.json();
  logger.info(`Created link with ID: ${JSON.stringify(ingestResponseJson.id)}`);

  expect(ingestResponse.status).toBe(202);

  // wait for 10 seconds for processing to complete with coldstart
  const FIFTEEN_SECONDS = 15000;
  await new Promise((resolve) => {
    setTimeout(resolve, FIFTEEN_SECONDS);
  });

  // query to check is has been processed
  // @ts-expect-error -- TODO: why aren't SST types being picked up?
  const queryByIdUrl = `${Api["query-api"].url}/links/${ingestResponseJson.id}`;

  logger.info("checking whether link has been processed");
  const queryResponse = await fetch(queryByIdUrl, {
    headers: { "Cache-Control": "no-cache" },
  });
  const { data } = await queryResponse.json();
  const queryResponseJson = data;

  logger.info("current link", { response: queryResponseJson });

  expect(queryResponse.status).toBe(200);

  const { id, url, title } = queryResponseJson;
  logger.info("processed link", { response: queryResponseJson });

  expect(id).toBe(ingestResponseJson.id);
  expect(url).toBe("https://example.com");
  expect(title).toBe("Example Domain");

  // delete link
  // @ts-expect-error -- TODO: why aren't SST types being picked up?
  const deleteByIdUrl = `${Api["ingest-api"].url}/links/${ingestResponseJson.id}`;

  logger.info("deleting link");
  const deleteResponse = await fetch(deleteByIdUrl, {
    method: "DELETE",
  });

  logger.info("deleted link", { response: deleteResponse });
}, 30000);
