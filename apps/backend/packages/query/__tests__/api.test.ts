import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { fromPartial } from "@total-typescript/shoehorn";
import { mockClient } from "aws-sdk-client-mock";
import { getAll, getById } from "../src/api";
import { getResultItem } from "./fixtures/get-results";
import { parsedResultsItems, scanResultsItems } from "./fixtures/scan-results";

const mockDynamoDb = mockClient(DynamoDBClient);

beforeEach(() => {
  mockDynamoDb.reset();
});

test("GET /links should return links", async () => {
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

test("GET /links should return an empty array if there are no links", async () => {
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

test("GET /links should return a 500 error and log if electrodb throws", async () => {
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
    error: "Failed to get all links",
  });
});

test("GET /links/{id} should return a link by ID", async () => {
  mockDynamoDb.onAnyCommand().resolves({
    // electrodb and aws-sdk have different types for the response
    // @ts-expect-error -- there is a mismatch between the expected and actual types
    Item: getResultItem,
  });

  const res = await getById(
    fromPartial({
      pathParameters: {
        id: "01F2QYVZJ5B6Y5ZJ3ZJ1T9Y1WJ",
      },
    }),
    fromPartial({}),
  );

  expect(res.statusCode).toEqual(200);

  const parsedBody = JSON.parse(res.body ?? "{}");

  expect(parsedBody).toEqual({
    data: parsedResultsItems[0],
  });
});

test("GET /links/{id} should return a 404 if the link does not exist", async () => {
  mockDynamoDb.onAnyCommand().resolves({
    Item: undefined,
  });

  const res = await getById(
    fromPartial({
      pathParameters: {
        id: "01F2QYVZJ5B6Y5ZJ3ZJ1T9Y1WJ",
      },
    }),
    fromPartial({}),
  );

  expect(res.statusCode).toEqual(404);

  const parsedBody = JSON.parse(res.body ?? "{}");

  expect(parsedBody).toEqual({
    error: "Link not found",
  });
});
