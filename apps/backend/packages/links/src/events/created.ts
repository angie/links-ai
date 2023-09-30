import { logger } from "logger";
import { EventHandler } from "sst/node/event-bus";
import { Events } from "../todo";

export const handler = EventHandler(Events.Created, async (evt) => {
  logger.log("Todo created", evt);
  await Promise.resolve("hello");
});
