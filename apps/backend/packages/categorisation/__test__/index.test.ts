import { Events } from "@backend/core/events";
import { fromPartial } from "@total-typescript/shoehorn";
import { logger } from "logger";
import { ulid } from "ulid";
import { handler } from "../src";
import * as openAIUtils from "../src/openai-utils";
import * as scrapers from "../src/scrapers";
import { responses } from "./fixtures/openai-responses";

vi.mock("logger");

vi.mock("@backend/core/events", () => ({
  Events: {
    Categorised: {
      publish: vi.fn(),
    },
  },
}));

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

  expect(logger.info).toHaveBeenCalledWith(
    "Categorised link",
    categorisedLinkEventBody,
  );
  expect(Events.Categorised.publish).toHaveBeenCalledWith(
    categorisedLinkEventBody,
  );
});
