import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { fromPartial } from "@total-typescript/shoehorn";
import { mockClient } from "aws-sdk-client-mock";
import { logger } from "logger";
import { Events } from "@backend/core/events";
import { handler } from "../../src/events/submitted";

vi.mock("logger");

test("should store link in database and emit link.stored event", async () => {
  const storedSpy = vi.spyOn(Events.Stored, "publish");

  const mockDynamo = mockClient(DynamoDBClient);
  mockDynamo.on(PutItemCommand).resolves({});

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

  expect(mockDynamo.calls()).toHaveLength(1);
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
