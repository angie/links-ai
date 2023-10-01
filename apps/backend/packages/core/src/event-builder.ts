import { createEventBuilder } from "sst/node/event-bus";

export const event = createEventBuilder({
  // FIXME: why does this generate a type error in github actions?
  // eslint-disable-next-line -- this fails on CI
  // @ts-ignore -- this fails on CI
  bus: "bus",
});
