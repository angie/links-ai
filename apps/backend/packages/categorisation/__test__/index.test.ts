import { EventBridgeClient } from "@aws-sdk/client-eventbridge";
import { fromPartial } from "@total-typescript/shoehorn";
import { mockClient } from "aws-sdk-client-mock";
import { logger } from "logger";
import { ulid } from "ulid";
import { handler } from "../src";
import * as openAIUtils from "../src/openai-utils";
import * as scrapers from "../src/scrapers";
import { responses } from "./fixtures/openai-responses";

vi.mock("logger");

const eventBridgeClientMock = mockClient(EventBridgeClient);

beforeEach(() => {
  eventBridgeClientMock.reset();
  eventBridgeClientMock.onAnyCommand().resolves({});
});

test("should analyse link and emit event to store", async () => {
  const id = ulid();
  vi.spyOn(openAIUtils, "getOpenAIClient").mockReturnValue(
    fromPartial({
      chat: {
        completions: {
          create: vi.fn().mockResolvedValue(responses[2]),
        },
      },
    }),
  );

  vi.spyOn(scrapers, "getUrlContents").mockResolvedValue({
    content: "hello world",
    isMain: true,
    title: "Really funny what happened to Liverpool",
  });

  await handler(
    fromPartial({
      id,
      "detail-type": "link.stored",
      detail: {
        properties: {
          id,
          url: "https://example.com",
        },
      },
    }),
  );

  expect(logger.info).toHaveBeenCalledWith("Categorising link", {
    id,
    url: "https://example.com",
  });

  const parsedContent = JSON.parse(
    responses[2].choices[0].message.content || "",
  );

  const categorisedLinkEventBody = {
    id,
    categories: ["Sports"],
    summary: parsedContent.summary,
    title: "Really funny what happened to Liverpool",
    url: "https://example.com",
  };

  expect(logger.info).toHaveBeenCalledWith("Categorised link", {
    id,
    url: "https://example.com",
  });

  const emittedEvent = eventBridgeClientMock.call(0).firstArg.input.Entries[0];
  // could type this properly...
  const emittedEventBody = JSON.parse(emittedEvent.Detail as string);

  expect(emittedEvent).toEqual({
    Detail: expect.any(String),
    DetailType: "link.categorised",
    EventBusName: expect.any(String),
    Source: expect.any(String),
  });

  expect(emittedEventBody.properties).toEqual(categorisedLinkEventBody);
});
