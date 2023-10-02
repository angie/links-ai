import { fromPartial } from "@total-typescript/shoehorn";
import { logger } from "logger";
import { handler } from "../../src/events/submitted";

vi.mock("logger");

test("should call log", async () => {
  await handler(
    fromPartial({
      id: "123",
      "detail-type": "link.submitted",
      detail: {
        properties: {
          id: "123",
          url: "https://example.com",
        },
      },
    }),
  );

  expect(logger.info).toHaveBeenCalledWith("Link created", {
    id: "123",
    url: "https://example.com",
  });
});
