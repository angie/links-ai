import { Events } from "@backend/core/events";
import { fromPartial } from "@total-typescript/shoehorn";
import { logger } from "logger";
import * as data from "../src/data";
import { handler } from "../src/update";

vi.mock("logger");

vi.mock("@backend/core/db", () => ({
  links: {
    patch: () => ({
      set: () => ({
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
    }),
  },
}));

const categorised = {
  categories: ["Sports"],
  id: "123",
  summary:
    "Referees' body PGMOL has released the full audio from the VAR hub relating to the Luis Diaz goal that was incorrectly disallowed in Tottenham Hotspur v Liverpool on Saturday.",
  title: "Really funny what happened to Liverpool",
  url: "https://example.com",
};

test("should update link in database and emit event", async () => {
  const storedCategorisedSpy = vi.spyOn(Events.StoredCategorised, "publish");

  vi.spyOn(data, "updateLink").mockResolvedValueOnce({
    data: categorised,
  });

  await handler(
    fromPartial({
      id: "123",
      "detail-type": "link.categorised",
      detail: {
        properties: categorised,
      },
    }),
  );

  expect(logger.info).toHaveBeenCalledWith(
    "Storing categorised link in database",
    categorised,
  );

  expect(logger.info).toHaveBeenCalledWith(
    "Stored categorised link",
    categorised,
  );

  expect(storedCategorisedSpy).toHaveBeenCalledWith(categorised);
});

test("should log an error if trying to insert a duplicate link", async () => {
  await handler(
    fromPartial({
      id: "123",
      "detail-type": "link.submitted",
      detail: {
        properties: categorised,
      },
    }),
  );

  expect(logger.error).toHaveBeenCalledWith("Failed to store link", {
    link: categorised,
    error: expect.any(Error),
  });
});
