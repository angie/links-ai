/// <reference lib="dom" />
import { logger } from "logger";
import { Api } from "sst/node/api";
import { expect, test } from "vitest";

test("should submit a link and categorise it", async () => {
  // @ts-expect-error -- TODO: why aren't SST types being picked up?
  const ingestApiUrl = `${Api["ingest-api"].url}/submit`;

  // submit a link
  const ingestResponse = await fetch(ingestApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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

  const {
    data: { id, url, title },
  } = queryResponseJson;
  logger.info("processed link", { response: queryResponseJson });

  expect(id).toBe(ingestResponseJson.id);
  expect(url).toBe("https://example.com");
  expect(title).toBe("Example Domain");
}, 30000);
