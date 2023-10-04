import { Events } from "@backend/core/events";
import { logger } from "logger";
import { EventHandler } from "sst/node/event-bus";
import { getOpenAIClient, getPrompt, parseCompletion } from "./openai-utils";
import { getUrlContents } from "./scrapers";

export const handler = EventHandler(Events.Stored, async (evt) => {
  const { id, url } = evt.properties;
  logger.info("Categorising link", { id, url });

  const { content, isMain, title } = await getUrlContents(url);

  const openai = getOpenAIClient();

  const prompt = getPrompt({ content, isMain, title, url });

  const completion = await openai.chat.completions.create({
    messages: [{ role: "assistant", content: prompt }],
    model: "gpt-3.5-turbo",
  });

  const { summary, categories } = parseCompletion(completion);

  logger.info("Categorised link", { id, url });

  await Events.Categorised.publish({
    categories,
    id,
    summary,
    title,
    url,
  });
});
