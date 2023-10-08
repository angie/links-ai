import { z } from "zod";

export const baseSchema = {
  id: z.string().ulid(),
  url: z.string().url(),
};

export const processedSchema = {
  categories: z.array(z.string()),
  summary: z.string(),
  title: z.string(),
};

const linkZodObject = z
  .object(baseSchema)
  .merge(z.object(processedSchema).partial());
const processedLinkZodObject = z
  .object(baseSchema)
  .merge(z.object(processedSchema));

export type Link = z.infer<typeof linkZodObject>;
export type ProcessedLink = z.infer<typeof processedLinkZodObject>;
