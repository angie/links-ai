import { Events } from "@backend/core/events";
import { logger } from "logger";
import { EventHandler } from "sst/node/event-bus";
import { createLink } from "./data";

export const handler = EventHandler(Events.Submitted, async (evt) => {
  const { id, url } = evt.properties;

  logger.info("Storing link in database", { id, url });

  try {
    const { data } = await createLink({ id, url });

    logger.info("Stored link", { ...data });

    await Events.Stored.publish({
      id,
      url,
    });
  } catch (error) {
    logger.error(error);
    logger.error("Failed to store link", { id, url, error });
  }
});
