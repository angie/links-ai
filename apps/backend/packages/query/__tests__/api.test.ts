import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { fromPartial } from "@total-typescript/shoehorn";
import { mockClient } from "aws-sdk-client-mock";
import { getAll } from "../src/api";
import { parsedResultsItems, scanResultsItems } from "./fixtures/scan-results";

export const isUlid = (value: string): boolean => {
  return /^[0-7][\dA-HJKMNP-TV-Z]{25}$/.test(value);
};

const mockDynamoDb = mockClient(DynamoDBClient);

beforeEach(() => {
  mockDynamoDb.reset();
});

test("should return links", async () => {
  mockDynamoDb.onAnyCommand().resolves({
    // electrodb and aws-sdk have different types for the response
    // @ts-expect-error -- there is a mismatch between the expected and actual types
    Items: scanResultsItems,
    Count: 2,
    ScannedCount: 2,
    ConsumedCapacity: undefined,
  });

  const res = await getAll(
    fromPartial({
      queryStringParameters: {
        limit: "10",
        offset: "0",
      },
    }),
    fromPartial({}),
  );

  expect(res.statusCode).toEqual(200);

  const parsedBody = JSON.parse(res.body ?? "{}");

  expect(parsedBody).toEqual({
    data: parsedResultsItems,
  });
});

test("should return an empty array if there are no links", async () => {
  mockDynamoDb.onAnyCommand().resolves({
    Items: [],
    Count: 0,
    ScannedCount: 0,
    ConsumedCapacity: undefined,
  });

  const res = await getAll(
    fromPartial({
      queryStringParameters: {
        limit: "10",
        offset: "0",
      },
    }),
    fromPartial({}),
  );

  expect(res.statusCode).toEqual(200);

  const parsedBody = JSON.parse(res.body ?? "{}");

  expect(parsedBody).toEqual({
    data: [],
  });
});

test("should return a 500 error and log if electrodb throws", async () => {
  mockDynamoDb.onAnyCommand().rejects(new Error("Something went wrong"));

  const res = await getAll(
    fromPartial({
      queryStringParameters: {
        limit: "10",
        offset: "0",
      },
    }),
    fromPartial({}),
  );

  expect(res.statusCode).toEqual(500);

  const parsedBody = JSON.parse(res.body ?? "{}");

  expect(parsedBody).toEqual({
    error: "Something went wrong",
  });
});
