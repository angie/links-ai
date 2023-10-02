import { Events } from "@backend/core/events";
import { fromPartial } from "@total-typescript/shoehorn";
import { create } from "../src/api";

export const isUlid = (value: string): boolean => {
  return /^[0-7][\dA-HJKMNP-TV-Z]{25}$/.test(value);
};

test("should emit `link.submitted` event and return 202", async () => {
  const submitEventSpy = vi.spyOn(Events.Submitted, "publish");
  const res = await create(
    fromPartial({
      body: JSON.stringify({ url: "https://example.com" }),
    }),
    fromPartial({}),
  );

  expect(res.statusCode).toEqual(202);

  const parsedBody = JSON.parse(res.body ?? "{}");

  expect(isUlid(parsedBody.id as string)).toEqual(true);

  expect(submitEventSpy).toHaveBeenCalledWith({
    id: parsedBody.id,
    url: "https://example.com",
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
