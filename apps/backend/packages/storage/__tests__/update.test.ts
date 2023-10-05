import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { Events } from "@backend/core/events";
import { fromPartial } from "@total-typescript/shoehorn";
import { mockClient } from "aws-sdk-client-mock";
import { logger } from "logger";
import * as data from "../src/data";
import { handler } from "../src/update";

vi.mock("logger");

const mockDynamo = mockClient(DynamoDBClient);
beforeEach(() => {
  mockDynamo.reset();
  vi.clearAllMocks();
});

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
  mockDynamo.on(UpdateItemCommand).rejects();

  await handler(
    fromPartial({
      id: "123",
      "detail-type": "link.submitted",
      detail: {
        properties: categorised,
      },
    }),
  );

  expect(mockDynamo.calls()).toHaveLength(1);
  expect(logger.error).toHaveBeenCalledWith("Failed to store link", {
    link: categorised,
    error: expect.any(Error),
  });
});
