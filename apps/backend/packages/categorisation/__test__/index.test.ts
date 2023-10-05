import { EventBridgeClient } from "@aws-sdk/client-eventbridge";
import { Events } from "@backend/core/events";
import { fromPartial } from "@total-typescript/shoehorn";
import { mockClient } from "aws-sdk-client-mock";
import { logger } from "logger";
import * as openAIUtils from "../src/openai-utils";
import * as scrapers from "../src/scrapers";
import { handler } from "../src";
import { responses } from "./fixtures/openai-responses";

vi.mock("@backend/core/events", () => ({
  Events: {
    Categorised: {
      publish: vi.fn(),
    },
  },
}));

vi.mock("logger");

const eventBridgeClientMock = mockClient(EventBridgeClient);

beforeEach(() => {
  eventBridgeClientMock.reset();
  eventBridgeClientMock.onAnyCommand().resolves({});
});

test("should analyse link and emit event to store", async () => {
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
      id: "123",
      "detail-type": "link.stored",
      detail: {
        properties: {
          id: "123",
          url: "https://example.com",
        },
      },
    }),
  );

  expect(logger.info).toHaveBeenCalledWith("Categorising link", {
    id: "123",
    url: "https://example.com",
  });

  const parsedContent = JSON.parse(
    responses[2].choices[0].message.content || "",
  );

  const categorisedLinkEventBody = {
    categories: ["Sports"],
    id: "123",
    summary: parsedContent.summary,
    title: "Really funny what happened to Liverpool",
    url: "https://example.com",
  };

  expect(logger.info).toHaveBeenCalledWith("Categorised link", {
    id: "123",
    url: "https://example.com",
  });

  expect(vi.mocked(Events.Categorised.publish)).toHaveBeenCalledWith(
    categorisedLinkEventBody,
  );
});
