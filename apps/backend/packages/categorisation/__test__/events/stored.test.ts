import { fromPartial } from "@total-typescript/shoehorn";
import { logger } from "logger";
import { handler } from "../../src/events/stored";

vi.mock("logger");

test("should call log", async () => {
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
});
