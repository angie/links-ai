import { Events } from "@backend/core/events";
import { fromPartial } from "@total-typescript/shoehorn";
import { logger } from "logger";
import { handler } from "../src/create";

vi.mock("logger");

vi.mock("@backend/core/db", () => ({
  links: {
    create: () => ({
      go: () => ({
        data: {
          id: "123",
          isArchived: false,
          isDeleted: false,
          timestamp: "2020-01-01T00:00:00.000Z",
          url: "https://example.com",
          userId: "1",
        },
      }),
    }),
  },
}));

test("should store link in database and emit link.stored event", async () => {
  const storedSpy = vi.spyOn(Events.Stored, "publish");

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

  expect(logger.info).toHaveBeenCalledWith("Storing link in database", {
    id: "123",
    url: "https://example.com",
  });

  expect(logger.info).toHaveBeenCalledWith("Stored link", {
    id: "123",
    isArchived: false,
    isDeleted: false,
    timestamp: expect.any(String),
    url: "https://example.com",
    userId: "1",
  });

  expect(storedSpy).toHaveBeenCalledWith({
    id: "123",
    url: "https://example.com",
  });
});

test("should log an error if trying to insert a duplicate link", async () => {
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

  expect(logger.error).toHaveBeenCalledWith("Failed to store link", {
    id: "123",
    url: "https://example.com",
    error: expect.any(Error),
  });
});
