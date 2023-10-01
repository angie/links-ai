import { Events } from "@backend/core/events";
import { logger } from "logger";
import { EventHandler } from "sst/node/event-bus";

export const handler = EventHandler(Events.Created, async (evt) => {
  logger.log("Todo created", evt);
  await Promise.resolve("hello");
});
