import { EventBridgeClient } from "@aws-sdk/client-eventbridge";
import { fromPartial } from "@total-typescript/shoehorn";
import { mockClient } from "aws-sdk-client-mock";
import { create } from "../src/api";

export const isUlid = (value: string): boolean => {
  return /^[0-7][\dA-HJKMNP-TV-Z]{25}$/.test(value);
};

const eventBridgeClientMock = mockClient(EventBridgeClient);

beforeEach(() => {
  eventBridgeClientMock.reset();
  eventBridgeClientMock.onAnyCommand().resolves({});
});

test("should emit `link.submitted` event and return 202", async () => {
  const res = await create(
    fromPartial({
      body: JSON.stringify({ url: "https://example.com" }),
    }),
    fromPartial({}),
  );

  expect(res.statusCode).toEqual(202);

  const parsedBody = JSON.parse(res.body ?? "{}");

  expect(isUlid(parsedBody.id as string)).toEqual(true);

  const emittedEvent = eventBridgeClientMock.call(0).firstArg.input.Entries[0];

  expect(emittedEvent).toEqual({
    Detail: JSON.stringify({
      properties: {
        id: parsedBody.id,
        url: "https://example.com",
      },
    }),
    DetailType: "link.submitted",
    EventBusName: expect.any(String),
    Source: expect.any(String),
  });
});

test("should return 400 if url is missing in request", async () => {
  const res = await create(
    fromPartial({
      body: JSON.stringify({}),
    }),
    fromPartial({}),
  );

  expect(res.statusCode).toEqual(400);
});
