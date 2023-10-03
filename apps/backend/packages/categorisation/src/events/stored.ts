import { Events } from "@backend/core/events";
import { logger } from "logger";
import { EventHandler } from "sst/node/event-bus";

export const handler = EventHandler(Events.Stored, async (evt) => {
  const { id, url } = evt.properties;
  logger.info("Categorising link", { id, url });
  await Promise.resolve("hello");
});
