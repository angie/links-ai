import OpenAi from "openai";
import { Config } from "sst/node/config";
import invariant from "tiny-invariant";

export function getOpenAIClient(): OpenAi {
  // @ts-expect-error -- TODO: why aren't SST types being picked up?
  return new OpenAi({ apiKey: (Config.OPENAI_API_KEY as string) || "" });
}

interface PromptInputs {
  content: string;
  isMain: boolean;
  title: string;
  url: string;
}

interface PromptResponse {
  summary: string;
  categories: string[];
}

export function getPrompt({
  content,
  isMain,
  title,
  url,
}: PromptInputs): string {
  const prompt = `
  Summarize this scraped article in one sentence and list its categories in JSON format. If no <main> tag is present, focus on the title and URL for categorization.

  Only include "Software Development" as a category if the article specifically talks about topics like coding, software engineering, development methodologies, etc. This category should be in addition to other relevant categories.
  
  {
    "summary": "your one-sentence summary here",
    "categories": ["category 1", "category 2"]
  }
  
  Title: ${title}
  Is Main: ${isMain}
  URL: ${url}
  Content: ${content}
  `;

  return prompt;
}

export function parseCompletion(
  completion: OpenAi.Chat.Completions.ChatCompletion,
): PromptResponse {
  const { content } = completion.choices[0].message;

  invariant(content, "Expected content to be defined");

  const { summary, categories } = JSON.parse(content) as PromptResponse;

  return { summary, categories };
}
