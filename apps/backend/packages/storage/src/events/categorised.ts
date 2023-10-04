import { Events } from "@backend/core/events";
import { logger } from "logger";
import { EventHandler } from "sst/node/event-bus";
import { updateLink } from "../data";

export const handler = EventHandler(Events.Categorised, async (evt) => {
  const { categories, id, summary, title, url } = evt.properties;

  logger.info("Storing categorised link in database", evt.properties);

  try {
    const { data } = await updateLink({ categories, id, summary, title, url });

    logger.info("Stored categorised link", { ...data });

    await Events.StoredCategorised.publish({
      categories,
      id,
      summary,
      title,
      url,
    });
  } catch (error) {
    logger.error(error);
    logger.error("Failed to store link", {
      link: { categories, id, summary, title, url },
      error,
    });
  }
});
