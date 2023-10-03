import { fromPartial } from "@total-typescript/shoehorn";
import { logger } from "logger";
import * as openAIUtils from "../../src/events/openai-utils";
import * as scrapers from "../../src/events/scrapers";
import { handler } from "../../src/events/stored";
import { responses } from "../fixtures/openai-responses";

vi.mock("logger");

test("should call log", async () => {
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

  expect(logger.info).toHaveBeenCalledWith("Categorised link", {
    categories: ["Sports"],
    id: "123",
    summary: parsedContent.summary,
    title: "Really funny what happened to Liverpool",
    url: "https://example.com",
  });
});
