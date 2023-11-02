import { fromPartial } from "@total-typescript/shoehorn";
import { getAll, getById } from "../src/api";
import { parsedResultsItems } from "./fixtures/scan-results";

const mockScanGo = vi.hoisted(() => vi.fn());
const mockGetGo = vi.hoisted(() => vi.fn());

vi.mock("@backend/core/db", () => ({
  links: {
    scan: {
      go: mockScanGo,
    },
    get: () => ({
      go: mockGetGo,
    }),
  },
}));

test("GET /links should return links", async () => {
  vi.mocked(mockScanGo).mockResolvedValue({ data: parsedResultsItems });
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
  vi.mocked(mockScanGo).mockResolvedValue({ data: [] });
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
  vi.mocked(mockScanGo).mockRejectedValue(new Error("kaboom"));
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
  vi.mocked(mockGetGo).mockResolvedValue({ data: parsedResultsItems[0] });
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
  vi.mocked(mockGetGo).mockResolvedValue({ data: null });
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
