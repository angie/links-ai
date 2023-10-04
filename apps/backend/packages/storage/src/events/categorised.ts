import { Events } from "@backend/core/events";
import { logger } from "logger";
import { EventHandler } from "sst/node/event-bus";
import { updateLink } from "../data";

export const handler = EventHandler(Events.Categorised, async (evt) => {
  const categorisedLink = evt.properties;

  logger.info("Storing categorised link in database", categorisedLink);

  try {
    const { data } = await updateLink(categorisedLink);

    logger.info("Stored categorised link", { ...data });

    await Events.StoredCategorised.publish(categorisedLink);
  } catch (error) {
    logger.error(error);
    logger.error("Failed to store link", { link: categorisedLink, error });
  }
});
