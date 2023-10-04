import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { fromPartial } from "@total-typescript/shoehorn";
import { mockClient } from "aws-sdk-client-mock";
import { logger } from "logger";
import { Events } from "@backend/core/events";
import { handler } from "../../src/events/categorised";

vi.mock("logger");

beforeEach(() => {
  vi.clearAllMocks();
});

test("should update link in database and emit event", async () => {
  const categorised = {
    categories: ["Sports"],
    id: "123",
    summary:
      "Referees' body PGMOL has released the full audio from the VAR hub relating to the Luis Diaz goal that was incorrectly disallowed in Tottenham Hotspur v Liverpool on Saturday.",
    title: "Really funny what happened to Liverpool",
    url: "https://example.com",
  };
  const storedCategorisedSpy = vi.spyOn(Events.StoredCategorised, "publish");

  const mockDynamo = mockClient(DynamoDBClient);
  mockDynamo.on(PutItemCommand).rejects();

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

  expect(mockDynamo.calls()).toHaveLength(1);
  expect(logger.info).toHaveBeenCalledWith(
    "Stored categorised link",
    categorised,
  );

  expect(storedCategorisedSpy).toHaveBeenCalledWith({
    id: "123",
    url: "https://example.com",
  });
});

test("should log an error if trying to insert a duplicate link", async () => {
  const mockDynamo = mockClient(DynamoDBClient);
  mockDynamo.onAnyCommand().rejects();

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

  expect(mockDynamo.calls()).toHaveLength(1);
  expect(logger.error).toHaveBeenCalledWith("Failed to store link", {
    id: "123",
    url: "https://example.com",
    error: expect.any(Error),
  });
});
